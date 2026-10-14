import { ApiResponse } from "@/types";
import { getAccessToken, clearAuthSession } from "../auth/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  code: number;
  data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAccessToken();

  const defaultHeaders: Record<string, string> = {};

  if (!(customConfig.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let responseData: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAuthSession();
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    let errorMessage = "An unexpected error occurred";

    if (responseData && typeof responseData === "object") {
      const errObj = responseData as { data?: { message?: string | string[] }; message?: string | string[] };
      const rawMsg = errObj.data?.message || errObj.message;
      if (Array.isArray(rawMsg)) {
        errorMessage = rawMsg.join(", ");
      } else if (typeof rawMsg === "string") {
        errorMessage = rawMsg;
      }
    }

    throw new ApiError(errorMessage, response.status, responseData);
  }

  // Backend wraps all responses in { status: 'success', code: number, data: T }
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    const apiEnvelope = responseData as ApiResponse<T>;
    return apiEnvelope.data;
  }

  return responseData as T;
}
