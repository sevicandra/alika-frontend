"use client";
import { createContext, useState, useRef, RefObject } from "react";

type MenuContextType = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  itemsRef: RefObject<HTMLDivElement | null>; // atau HTMLUListElement, tergantung elemen kamu
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const MenuContext = createContext<MenuContextType>({
  buttonRef: { current: null },
  itemsRef: { current: null },
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export default function Dropdown({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null); // Ganti ke HTMLUListElement kalau kamu pakai <ul>
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = {
    buttonRef,
    itemsRef,
    isOpen,
    openMenu: () => setIsOpen(true),
    closeMenu: () => setIsOpen(false),
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}
