"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type TerminContextType = {
  refresh: number;
  setRefresh: () => void;
};

const TerminContext = createContext<TerminContextType | undefined>(undefined);

export function TerminProvider({ children }: { children: React.ReactNode }) {
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
    <TerminContext.Provider value={value}>{children}</TerminContext.Provider>
  );
}

export const useTermin = () => {
  const context = useContext(TerminContext);
  if (!context) {
    throw new Error("useTermin must be used within a TerminProvider");
  }
  return context;
};
