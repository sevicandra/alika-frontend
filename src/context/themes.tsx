"use client";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

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

  // Memoize handler functions
  const handlerClose = useCallback(() => {
    setShow(false);
  }, []);

  const handlerOpen = useCallback(() => {
    setShow(true);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const openMenu = useCallback(() => handlerOpen(), [handlerOpen]);
  const handleSetTheme = useCallback(
    (newTheme: string) => setTheme(newTheme),
    [],
  );

  useEffect(() => {
    const initialTheme = localStorage.getItem("theme") || "";
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isOpen,
      closeMenu,
      openMenu,
      theme,
      setTheme: handleSetTheme,
      show,
      handlerClose,
    }),
    [isOpen, closeMenu, openMenu, theme, handleSetTheme, show, handlerClose],
  );

  return (
    <ThemesContext.Provider value={value}>{children}</ThemesContext.Provider>
  );
}
