"use client";
import { createContext, useState, useEffect } from "react";

type ThemesContextType = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  show: boolean;
  handlerClose: () => void;

};

export const ThemesContext = createContext<ThemesContextType>({
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  theme: "",
  setTheme: () => {},
  show: true,
  handlerClose: () => {},
});

export function ThemesProvider({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [show, setShow] = useState(true);

  const handlerClose = () => {
    setShow(false);
  };

  const handlerOpen = () => {
    setShow(true);
    setIsOpen(true);
  };

  useEffect(() => {
    const initialTheme = localStorage.getItem("theme") || "";
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemesContext.Provider
      value={{
        isOpen,
        closeMenu: () => setIsOpen(false),
        openMenu: () => handlerOpen(),
        theme,
        setTheme: (newTheme: string) => setTheme(newTheme),
        show,
        handlerClose,
      }}
    >
      {children}
    </ThemesContext.Provider>
  );
}
