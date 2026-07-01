"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import { cn } from "@/lib/utils";
import Label from "@/components/atoms/label.atom";

// ----------------------------------------------------------------
// Context & Provider
// ----------------------------------------------------------------
type MenuContextType = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  itemsRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function Menu({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const value = {
    buttonRef,
    itemsRef,
    isOpen,
    openMenu,
    closeMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

// ----------------------------------------------------------------
// MenuButton
// ----------------------------------------------------------------
export function MenuButton({ children }: { children: React.ReactNode }) {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("MenuButton must be used within a Menu component");
  }
  const { buttonRef, openMenu } = context;
  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        e.stopPropagation();
        openMenu();
      }}
      className="w-full focus:outline-none"
      type="button"
    >
      {children}
    </button>
  );
}

// ----------------------------------------------------------------
// MenuItems
// ----------------------------------------------------------------
type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function MenuItems({
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
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("MenuItems must be used within a Menu component");
  }
  const { buttonRef, isOpen, closeMenu, itemsRef } = context;

  const [style, setStyle] = useState<React.CSSProperties>({});
  const tickingRef = useRef(false);
  const lastCallRef = useRef(0);
  const THROTTLE_DELAY = 100;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const buttonPosition = buttonRef.current.getBoundingClientRect();
    let newStyle: React.CSSProperties = {};

    switch (`${anchor} ${align}`) {
      case "top start":
        newStyle = {
          bottom: window.innerHeight - buttonPosition.top + 2,
          left: buttonPosition.left,
          width: width || buttonPosition.width,
        };
        break;
      case "bottom start":
        newStyle = {
          top: buttonPosition.bottom + 2,
          left: buttonPosition.left,
          width: width || buttonPosition.width,
        };
        break;
      case "left start":
        newStyle = {
          top: buttonPosition.top,
          right: window.innerWidth - buttonPosition.left + 2,
          width: width || buttonPosition.width,
        };
        break;
      case "right start":
        newStyle = {
          top: buttonPosition.top,
          left: buttonPosition.right + 2,
          width: width || buttonPosition.width,
        };
        break;
      case "top end":
        newStyle = {
          bottom: window.innerHeight - buttonPosition.top + 2,
          right: window.innerWidth - buttonPosition.right,
          width: width || buttonPosition.width,
        };
        break;
      case "bottom end":
        newStyle = {
          top: buttonPosition.bottom + 2,
          right: window.innerWidth - buttonPosition.right,
          width: width || buttonPosition.width,
        };
        break;
      case "left end":
        newStyle = {
          top: buttonPosition.bottom,
          right: window.innerWidth - buttonPosition.left + 2,
          width: width || buttonPosition.width,
        };
        break;
      case "right end":
        newStyle = {
          top: buttonPosition.bottom,
          left: buttonPosition.right + 2,
          width: width || buttonPosition.width,
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
        {/* Backdrop for click outside */}
        <div
          className="fixed inset-0 z-50 cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        />

        <div
          ref={itemsRef}
          className={cn(
            "fixed z-50 h-fit rounded-box border border-base-content/10 bg-base-200 p-2 shadow-xl transition-all duration-200",
            className,
          )}
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

// ----------------------------------------------------------------
// MenuItem (Label)
// ----------------------------------------------------------------

export const MenuItem = Label;
