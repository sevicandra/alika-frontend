"use client";
import { createContext, useState, useMemo, useContext } from "react";
type TteContextType = {
  refresh: number;
  setRefresh: () => void;
};

const TteContext = createContext<TteContextType | undefined>(undefined);

export function TteProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const setRefresh = () => setRefreshState((prev) => prev + 1);

  const value = useMemo(
    () => ({
      refresh,
      setRefresh,
    }),
    [refresh],
  );
  return (
    <TteContext.Provider value={value}>{children}</TteContext.Provider>
  );
}

export const useTte = () => {
  const context = useContext(TteContext);
  if (!context) {
    throw new Error("useTte must be used within a TteProvider");
  }
  return context;
};
