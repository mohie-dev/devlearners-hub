"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, LoginPayload, RegisterPayload } from "@/lib/api/auth";
import { meApi } from "@/lib/api/me";
import {
  setAccessToken,
  setStoredUser,
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  isAuthenticated as checkIsAuth,
} from "@/lib/auth/token";
import { AuthUser, UserProfile } from "@/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    return getStoredUser();
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!getAccessToken();
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setStoredUser(data.user);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setStoredUser(data.user);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const logout = useCallback(() => {
    clearAuthSession();
    setCurrentUser(null);
    setIsLoggedIn(false);
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  return {
    user: currentUser,
    isLoggedIn,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
}

export function useProfile() {
  const isAuth = typeof window !== "undefined" ? checkIsAuth() : false;

  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => meApi.getProfile(),
    enabled: isAuth,
  });
}
