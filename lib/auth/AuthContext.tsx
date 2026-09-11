"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  googleAuthRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  registerRequest,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { LmsUser } from "@/types/lms";

type AuthState = {
  user: LmsUser | null;
  accessToken: string | null;
  /** True while the initial silent-refresh-on-load check is in flight. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LmsUser>;
  register: (name: string, email: string, password: string) => Promise<LmsUser>;
  loginWithGoogle: (idToken: string) => Promise<LmsUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LmsUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const { accessToken: token } = await refreshRequest();
        const me = await meRequest(token);
        if (cancelled) return;
        setAccessToken(token);
        setUser({ id: me.userId, name: me.name, email: me.email, role: me.role });
      } catch {
        // No valid refresh cookie (e.g. never logged in) — stay logged out.
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest({ email, password });
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerRequest({ name, email, password });
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const result = await googleAuthRequest(idToken);
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) await logoutRequest(accessToken);
    } catch (error) {
      // Even if the server call fails (e.g. token already expired), clear local state.
      if (!(error instanceof ApiError)) throw error;
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({ user, accessToken, isLoading, login, register, loginWithGoogle, logout }),
    [user, accessToken, isLoading, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
