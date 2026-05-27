// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI, parseAuthPayload } from "@/services/api";
import type { AuthUser } from "@/types/dashboard";

type LoginResult = {
  success: boolean;
  ok: boolean;
  message?: string;
  user?: AuthUser;
};

type RegisterResult = {
  success: boolean;
  message?: string;
  user?: AuthUser;
};

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<RegisterResult>;
  logout: () => void;
}

function persistSession(accessToken: string, user: AuthUser, refreshToken?: string) {
  localStorage.setItem("sk_token", accessToken);
  localStorage.setItem("sk_user", JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem("sk_refresh_token", refreshToken);
  }
  document.cookie = `sk_token=${accessToken}; path=/; SameSite=Strict`;
}

function clearSession() {
  authAPI.logout();
  document.cookie = "sk_token=; path=/; max-age=0";
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  isLoading: true,
  isLoggedIn: false,
  login: async () => ({ success: false, ok: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("sk_token");
    const storedUser = localStorage.getItem("sk_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem("sk_user");
      }
    }

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    authAPI.me().then((res) => {
      if (res.ok) {
        const meUser =
          (res.data as { data?: { user?: AuthUser } })?.data?.user ??
          (res.data as { user?: AuthUser })?.user;
        if (meUser) {
          setUser(meUser);
          localStorage.setItem("sk_user", JSON.stringify(meUser));
        }
      } else {
        clearSession();
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login(email, password);

    if (!res.ok) {
      return {
        success: false,
        ok: false,
        message: res.message || "Invalid credentials",
      };
    }

    const { accessToken, refreshToken, user: authUser } = parseAuthPayload(
      res.data as Record<string, unknown>
    );

    if (!accessToken || !authUser) {
      return {
        success: false,
        ok: false,
        message:
          (res.data as { message?: string })?.message ||
          res.message ||
          "Invalid credentials",
      };
    }

    const typedUser = authUser as AuthUser;
    persistSession(accessToken, typedUser, refreshToken);
    setToken(accessToken);
    setUser(typedUser);

    return { success: true, ok: true, user: typedUser };
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string = "employee"
    ) => {
      const res = await authAPI.register(name, email, password, role);

      if (!res.ok) {
        return {
          success: false,
          message: res.message || "Registration failed",
        };
      }

      const { accessToken, refreshToken, user: authUser } = parseAuthPayload(
        res.data as Record<string, unknown>
      );

      if (!accessToken || !authUser) {
        return {
          success: false,
          message:
            (res.data as { message?: string })?.message || "Registration failed",
        };
      }

      const typedUser = authUser as AuthUser;
      persistSession(accessToken, typedUser, refreshToken);
      setToken(accessToken);
      setUser(typedUser);

      return { success: true, user: typedUser };
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoading: loading,
        isLoggedIn,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export { apiCall } from "@/services/api";
