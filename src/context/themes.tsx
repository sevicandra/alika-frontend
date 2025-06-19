"use client";
import { createContext, useState, useEffect } from "react";

type ThemesContextType = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemesContext = createContext<ThemesContextType>({
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  theme: "",
  setTheme: () => {},
});

export function ThemesProvider({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const initialTheme = localStorage.getItem("theme") || "";
    if (!theme) {
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    } else if (initialTheme !== theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);
  return (
    <ThemesContext.Provider
      value={{
        isOpen,
        closeMenu: () => setIsOpen(false),
        openMenu: () => setIsOpen(true),
        theme,
        setTheme: (newTheme: string) => setTheme(newTheme),
      }}
    >
      {children}
    </ThemesContext.Provider>
  );
}
