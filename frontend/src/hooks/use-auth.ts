"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type { LoginPayload, RegisterPayload } from "@/lib/api/auth";
import { meApi } from "@/lib/api/me";
import {
  clearAuthSession,
  getAuthSessionSnapshot,
  getServerAuthSessionSnapshot,
  setAuthSession,
  subscribeAuthSession,
} from "@/lib/auth/token";
import type { UserProfile } from "@/types";

export function useAuthSession() {
  return useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getServerAuthSessionSnapshot,
  );
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, isLoggedIn } = useAuthSession();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuthSession(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuthSession(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const logout = useCallback(() => {
    clearAuthSession();
    queryClient.clear();
    router.replace("/login");
  }, [queryClient, router]);

  return {
    user,
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
  const { isLoggedIn } = useAuthSession();

  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => meApi.getProfile(),
    enabled: isLoggedIn,
  });
}
