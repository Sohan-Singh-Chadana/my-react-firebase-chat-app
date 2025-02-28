import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const applyTheme = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.setAttribute("data-theme", applyTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // System theme change detect karega
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (localStorage.getItem("theme") === "system") {
        document.documentElement.setAttribute("data-theme", getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
