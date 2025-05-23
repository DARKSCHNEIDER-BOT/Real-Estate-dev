import React, { createContext, useState, useEffect, useContext } from "react";
import { login, register, getUserProfile, socialLogin } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);

      // If we have a stored user (from social login), use that directly
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          fetchUserProfile(storedToken);
        }
      } else {
        // Otherwise fetch the user profile
        fetchUserProfile(storedToken);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const userData = await getUserProfile(authToken);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If token is invalid, clear it
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast({
        title: "Login successful",
        description: "Welcome back to RealEstateHub!",
        className:
          "animate-in slide-in-from-bottom-5 bg-green-50 border-green-200",
      });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        className: "animate-in shake-x-3",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await register({ name, email, password, role });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
        className:
          "animate-in slide-in-from-bottom-5 bg-green-50 border-green-200",
      });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
        className: "animate-in shake-x-3",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await socialLogin(provider);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast({
        title: "Social login successful",
        description: `You've successfully logged in with ${provider}!`,
        className:
          "animate-in slide-in-from-bottom-5 bg-green-50 border-green-200",
      });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `${provider} login failed`;
      setError(errorMessage);
      toast({
        title: "Social login failed",
        description: errorMessage,
        variant: "destructive",
        className: "animate-in shake-x-3",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also remove stored user data
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      className: "animate-in fade-in-50",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login: loginUser,
        register: registerUser,
        socialLogin: handleSocialLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
