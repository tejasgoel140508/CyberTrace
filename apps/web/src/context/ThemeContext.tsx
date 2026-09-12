import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("cybertrace-theme") === "light" ? "light" : "dark"));
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cybertrace-theme", theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(value => value === "dark" ? "light" : "dark") }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
