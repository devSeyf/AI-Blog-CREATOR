import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import {
  getCurrentUser,
  loginUser,
  logout as logoutUser,
  registerUser,
} from "../utils/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (
    name: string,
    email: string,
    password: string
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

  const checkAuth = async () => {
    try {
      setUser(await getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await loginUser(email, password);
      if (!loggedInUser) throw new Error("Login did not return a user account");
      setUser(loggedInUser);
      toast.success("Login successful");

      return { success: true };
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Login failed");

      return { success: false };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const registeredUser = await registerUser(name, email, password);
      if (!registeredUser) throw new Error("Registration did not return a user account");
      setUser(registeredUser);
      toast.success("Registration successful!");

      return { success: true };
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );

      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();

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
