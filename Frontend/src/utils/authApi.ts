import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/users",
  withCredentials: true,
});

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
    const res = await api.post<ApiResponse<User>>("/register", {
      name,
      email,
      password,
    });

    return res.data.user || null;
  } catch (error: any) {
    console.error("Register error:", error.response?.data);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed",
    );
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const res = await api.post<ApiResponse<User>>("/login", {
      email,
      password,
    });

    return res.data.user || null;
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
بب
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed",
    );
  }
};

export const getCurrentuser = async (): Promise<User | null> => {
  try {
    const res = await api.get<ApiResponse<User>>("/me", {});

    return res.data.user || null;
  } catch (error: any) {
    console.error("Auth Check Error :", error.response?.data);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const res = await api.post("/logout ");

    return res.data.user || null;
  } catch (error: any) {
    console.error("logout error :", error.response?.data);

    throw new Error("Logout failed");
  }
};
