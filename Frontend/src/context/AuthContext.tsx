import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "https://backendblogainode.onrender.com/users/me",
        {
          withCredentials: true,
        },
      );

      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        "https://backendblogainode.onrender.com/users/login",
        { email, password },
        { withCredentials: true },
      );

      setUser(res.data.user);
      toast.success("login successful");
      return { success: true };
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "login failed",
      );
      return { success: false };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(
        "https://backendblogainode.onrender.com/users/register",
        { name, email, password },
        { withCredentials: true },
      );
      setUser(res.data.user);
      toast.success("Registration successful!");
      return { success: true };
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed",
      );
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(
        "https://backendblogainode.onrender.com/users/logout",
        {},
        { withCredentials: true },
      );

      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
