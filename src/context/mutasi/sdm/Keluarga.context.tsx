"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type KelaurgaContextType = {
  refresh: number;
  setRefresh: () => void;
};

const KelaurgaContext = createContext<KelaurgaContextType | undefined>(undefined);

export function KelaurgaProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const setRefresh = () => setRefreshState((prev) => prev + 1);
  const value = useMemo(
    () => ({
      refresh,
      setRefresh,
    }),
    [refresh]
  );
  return (
    <KelaurgaContext.Provider value={value}>{children}</KelaurgaContext.Provider>
  );
}

export const useKelaurga = () => {
  const context = useContext(KelaurgaContext);
  if (!context) {
    throw new Error("useKelaurga must be used within a KelaurgaProvider");
  }
  return context;
};
