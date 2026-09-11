"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type PortalTheme = "light" | "dark";

const STORAGE_KEY = "eihe_portal_theme";

type ThemeState = {
  theme: PortalTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

function applyTheme(theme: PortalTheme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode, etc.) — theme just won't persist.
  }
}

/** Scoped to the admin/student portal shell — see the `.portal-shell`
 * selector in globals.css. Mounting this on a marketing page would set the
 * `data-theme` attribute on <html> but have no visual effect there. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PortalTheme>("light");

  useEffect(() => {
    let initial: PortalTheme = "light";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }
    } catch {
      // Fall back to light.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
