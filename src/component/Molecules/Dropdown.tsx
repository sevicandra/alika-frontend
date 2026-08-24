"use client";
import {
  createContext,
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import { cn } from "@/lib/utils";
import Label from "../Atoms/Label";

// ────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────
type MenuContextType = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  itemsRef: RefObject<HTMLDivElement | null>;
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

// ────────────────────────────────────────────────────────────
// MENU (Provider) — previously Atoms/DropdownMenu
// ────────────────────────────────────────────────────────────
function Menu({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = {
    buttonRef,
    itemsRef,
    isOpen,
    openMenu: () => setIsOpen(true),
    closeMenu: () => setIsOpen(false),
  };

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────
// MENU BUTTON — previously Atoms/DropdownButton
// ────────────────────────────────────────────────────────────
function MenuButton({ children }: { children: React.ReactNode }) {
  const { buttonRef, openMenu } = useContext(MenuContext);
  return (
    <button ref={buttonRef} onClick={openMenu} className="w-full">
      {children}
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// MENU ITEMS — previously Atoms/DropdownItems
// Throttled scroll/resize position tracking.
// ────────────────────────────────────────────────────────────
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function MenuItems({
  children,
  anchor = "bottom",
  align = "end",
  width,
  className,
  ...props
}: {
  children: React.ReactNode;
  anchor?: "top" | "bottom" | "left" | "right";
  align?: "start" | "end";
  width?: number;
} & DivProps) {
  const { buttonRef, isOpen, closeMenu, itemsRef } = useContext(MenuContext);
  const [style, setStyle] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    translate?: string;
  }>();

  const tickingRef = useRef(false);
  const lastCallRef = useRef(0);
  const THROTTLE_DELAY = 100;

  const updatePosition = useCallback(() => {
    const buttonPosition = buttonRef.current?.getBoundingClientRect();
    let newStyle: typeof style | undefined;

    switch (anchor + " " + align) {
      case "top start":
        newStyle = {
          bottom: window.innerHeight - (buttonPosition?.top || 0) + 2,
          left: buttonPosition?.left,
          width: width || buttonPosition?.width,
        };
        break;
      case "bottom start":
        newStyle = {
          top: (buttonPosition?.bottom || 0) + 2,
          left: buttonPosition?.left,
          width: width || buttonPosition?.width,
        };
        break;
      case "left start":
        newStyle = {
          top: buttonPosition?.top,
          right: window.innerWidth - (buttonPosition?.left || 0) + 2,
          width: width || buttonPosition?.width,
        };
        break;
      case "right start":
        newStyle = {
          top: buttonPosition?.top,
          left: (buttonPosition?.right || 0) + 2,
          width: width || buttonPosition?.width,
        };
        break;
      case "top end":
        newStyle = {
          bottom: window.innerHeight - (buttonPosition?.top || 0) + 2,
          right: window.innerWidth - (buttonPosition?.right || 0),
          width: width || buttonPosition?.width,
        };
        break;
      case "bottom end":
        newStyle = {
          top: (buttonPosition?.bottom || 0) + 2,
          right: window.innerWidth - (buttonPosition?.right || 0),
          width: width || buttonPosition?.width,
        };
        break;
      case "left end":
        newStyle = {
          top: buttonPosition?.bottom,
          right: window.innerWidth - (buttonPosition?.left || 0) + 2,
          width: width || buttonPosition?.width,
        };
        break;
      case "right end":
        newStyle = {
          top: buttonPosition?.bottom,
          left: (buttonPosition?.right || 0) + 2,
          width: width || buttonPosition?.width,
        };
        break;
    }

    setStyle(newStyle);
  }, [align, anchor, buttonRef, width]);

  useEffect(() => {
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastCallRef.current < THROTTLE_DELAY) {
        if (!tickingRef.current) {
          tickingRef.current = true;
          requestAnimationFrame(() => {
            updatePosition();
            tickingRef.current = false;
          });
        }
        return;
      }
      lastCallRef.current = now;
      requestAnimationFrame(() => {
        updatePosition();
      });
    };

    const initialFrame = requestAnimationFrame(() => {
      updatePosition();
    });

    window.addEventListener("resize", throttledUpdate, { passive: true });
    window.addEventListener("scroll", throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", throttledUpdate);
      window.removeEventListener("scroll", throttledUpdate);
      cancelAnimationFrame(initialFrame);
    };
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      updatePosition();
      lastCallRef.current = Date.now();
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen, updatePosition]);

  return (
    isOpen && (
      <>
        <div
          className={`fixed inset-0 z-50`}
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        />
        <div
          ref={itemsRef}
          className={cn("fixed z-50 h-fit rounded-lg shadow", className)}
          {...props}
          onClick={(e) => e.stopPropagation()}
          style={style}
        >
          {children}
        </div>
      </>
    )
  );
}

// ────────────────────────────────────────────────────────────
// MENU ITEM — re-uses Label atom
// ────────────────────────────────────────────────────────────
const MenuItem = Label;

export { Menu, MenuButton, MenuItems, MenuItem };
export default Menu;
