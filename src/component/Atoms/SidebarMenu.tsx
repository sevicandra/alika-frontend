"use client";
import { createContext, useState, useRef, useEffect } from "react";
import Icon from "../Atoms/LabelIcon";
type SidebarContextType = {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  itemsRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  buttonRef: { current: null },
  itemsRef: { current: null },
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const contextValue = {
    buttonRef,
    itemsRef,
    isOpen,
    openMenu: () => setIsOpen(true),
    closeMenu: () => setIsOpen(false),
  };

  useEffect(() => {
    const checkScreen = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return (
    <SidebarContext.Provider value={contextValue}>
      <aside
        className={`bg-primary-500 absolute md:relative top-0 left-0 z-20 h-full max-h-full overflow-y-hidden ${isOpen ? "w-3xs" : "w-[50px]"} grid grid-cols-1 grid-rows-[auto_1fr] transition-[width] duration-500`}
      >
        <div className={`bg-secondary/50 relative h-[50px] w-full p-1`}>
          <div
            className={`bg-base-200/50 hover:bg-base-200 rounded-box absolute right-1 flex aspect-square h-[42px] cursor-pointer items-center justify-center transition-transform duration-500 ease-in-out`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`text-base-content transition-transform duration-500 ${
                isOpen ? "rotate-180" : "delay-250"
              }`}
            >
              <Icon icon="chevron-right" width={20} height={20} />
            </span>
          </div>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll py-8">
          {children}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}
