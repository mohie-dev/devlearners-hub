import type { AuthUser } from "@/types";

const TOKEN_KEY = "dlh_access_token";
const USER_KEY = "dlh_user";
const AUTH_SESSION_CHANGED_EVENT = "dlh-auth-session-changed";

export interface AuthSessionSnapshot {
  user: AuthUser | null;
  isLoggedIn: boolean;
}

const EMPTY_AUTH_SESSION: AuthSessionSnapshot = { user: null, isLoggedIn: false };
let authSessionSnapshot: AuthSessionSnapshot | null = null;

function readAuthSession(): AuthSessionSnapshot {
  if (typeof window === "undefined") return EMPTY_AUTH_SESSION;

  const isLoggedIn = Boolean(localStorage.getItem(TOKEN_KEY));
  return {
    isLoggedIn,
    user: isLoggedIn ? getStoredUser() : null,
  };
}

function notifyAuthSessionChanged(): void {
  if (typeof window === "undefined") return;
  authSessionSnapshot = readAuthSession();
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function getAuthSessionSnapshot(): AuthSessionSnapshot {
  if (typeof window === "undefined") return EMPTY_AUTH_SESSION;
  authSessionSnapshot ??= readAuthSession();
  return authSessionSnapshot;
}

export function getServerAuthSessionSnapshot(): AuthSessionSnapshot {
  return EMPTY_AUTH_SESSION;
}

export function subscribeAuthSession(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleSessionChange = () => {
    authSessionSnapshot = readAuthSession();
    listener();
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== null && event.key !== TOKEN_KEY && event.key !== USER_KEY) return;
    handleSessionChange();
  };

  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function setAuthSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthSessionChanged();
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthSessionChanged();
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthSessionChanged();
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthSessionChanged();
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  notifyAuthSessionChanged();
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthSessionChanged();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

