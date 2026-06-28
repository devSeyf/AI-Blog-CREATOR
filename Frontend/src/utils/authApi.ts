import { api } from "./apiClient";
import { normalizeApiError } from "./apiErrors";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  imageUrl?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  user?: T;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const res = await api.post<ApiResponse<User>>("/users/register", {
      name,
      email,
      password,
    });

    return res.data.user || null;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const res = await api.post<ApiResponse<User>>("/users/login", {
      email,
      password,
    });

    return res.data.user || null;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Login failed");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get<ApiResponse<User>>("/users/me");

    return res.data.user || null;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/users/logout");
  } catch (error: unknown) {
    throw normalizeApiError(error, "Logout failed");
  }
};
