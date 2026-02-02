"use client";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

type PopUpContextType = {
  backdropRef: React.RefObject<HTMLDivElement | null>;
};

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

export function PopUpProvider({ children }: { children: React.ReactNode }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  const value = useMemo(
    () => ({
      backdropRef,
    }),
    [backdropRef],
  );

  function onClick() {
    backdropRef.current?.classList.add("animate-shake");
    backdropRef.current?.classList.add("shadow-error/50");
    backdropRef.current?.classList.add("shadow-[0_0_10px]");
    baseRef.current?.classList.add("inset-shadow-[0_0_20px]");
    baseRef.current?.classList.add("inset-shadow-error");
    baseRef.current?.classList.add("bg-error/10");

    setTimeout(() => {
      backdropRef.current?.classList.remove("animate-shake");
      backdropRef.current?.classList.remove("shadow-error/50");
      backdropRef.current?.classList.remove("shadow-[0_0_10px]");
      baseRef.current?.classList.remove("inset-shadow-[0_0_20px]");
      baseRef.current?.classList.remove("inset-shadow-error");
      baseRef.current?.classList.remove("bg-error/10");
    }, 300);
  }

  useEffect(() => {
    if (backdropRef.current) {
      backdropRef.current.classList.add("transition-all");
      backdropRef.current.classList.add("duration-300");
      backdropRef.current.classList.add("ease-in-out");
    }
  }, [backdropRef]);

  return (
    <PopUpContext.Provider value={value}>
      <div
        className="fixed inset-0 z-50 flex overflow-auto p-4 backdrop-blur-lg transition-all duration-300 ease-in-out"
        onClick={() => onClick()}
        ref={baseRef}
      >
        {children}
      </div>
    </PopUpContext.Provider>
  );
}

export function usePopUp() {
  const context = useContext(PopUpContext);
  if (context === undefined) {
    throw new Error("usePopUp must be used within a PopUpProvider");
  }
  return context;
}
