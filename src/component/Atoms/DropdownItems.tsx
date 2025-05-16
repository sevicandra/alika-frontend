"use client";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "./DropdownMenu";
import { cn } from "@/lib/utils";

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
  const updatePosition = () => {
    const buttonPosition = buttonRef.current?.getBoundingClientRect();
    switch (anchor + " " + align) {
      case "top start":
        setStyle({
          bottom: window.innerHeight - (buttonPosition?.top || 0) + 2,
          left: buttonPosition?.left,
          width: width || buttonPosition?.width,
        });
        break;
      case "bottom start":
        setStyle({
          top: (buttonPosition?.bottom || 0) + 2,
          left: buttonPosition?.left,
          width: width || buttonPosition?.width,
        });
        break;
      case "left start":
        setStyle({
          top: buttonPosition?.top,
          right: window.innerWidth - (buttonPosition?.left || 0) + 2,
          width: width || buttonPosition?.width,
        });
        break;
      case "right start":
        setStyle({
          top: buttonPosition?.top,
          left: (buttonPosition?.right || 0) + 2,
          width: width || buttonPosition?.width,
        });
        break;
      case "top end":
        setStyle({
          bottom: window.innerHeight - (buttonPosition?.top || 0) + 2,
          right: window.innerWidth - (buttonPosition?.right || 0),
          width: width || buttonPosition?.width,
        });
        break;
      case "bottom end":
        setStyle({
          top: (buttonPosition?.bottom || 0) + 2,
          right: window.innerWidth - (buttonPosition?.right || 0),
          width: width || buttonPosition?.width,
        });
        break;
      case "left end":
        setStyle({
          top: buttonPosition?.bottom,
          right: window.innerWidth - (buttonPosition?.left || 0) + 2,
          width: width || buttonPosition?.width,
        });
        break;
      case "right end":
        setStyle({
          top: buttonPosition?.bottom,
          left: (buttonPosition?.right || 0) + 2,
          width: width || buttonPosition?.width,
        });
        break;
    }
  };
  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  useEffect(() => {
    updatePosition();
  }, [isOpen]);

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
          className={cn("fixed h-fit z-50 rounded-lg shadow", className)}
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

export default MenuItems;
