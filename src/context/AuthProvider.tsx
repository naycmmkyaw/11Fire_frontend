import React, { useState, useEffect } from "react";
import type { User, AuthContextType } from "../types";
import Axios from "../services/axiosInstance";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = async () => {
      try {
        // First check if we have a stored token
        const token = localStorage.getItem("authToken");
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await Axios.get("/auth/me");
        if (response.data?.user) {
          const backendUser = response.data.user;

          const mappedUser: User = {
            id: String(backendUser._id),
            email: backendUser.email,
            name: backendUser.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              backendUser.username || backendUser.email
            )}&background=ef4444&color=fff`,
            activeGroup: backendUser.activeSwarm || null,
          };

          setUser(mappedUser);
          localStorage.setItem("11fire_user", JSON.stringify(mappedUser));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        // Clear invalid tokens
        localStorage.removeItem("authToken");
        localStorage.removeItem("11fire_user");
        localStorage.removeItem("11fire_groups");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await Axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.clear();
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
