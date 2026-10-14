import { apiClient } from "./client";
import { AuthResponse, SubjectDepartment, SubjectLevel } from "@/types";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  department: SubjectDepartment;
  studyLevel: SubjectLevel;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
