"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type BiayaContextType = {
  refresh: number;
  setRefresh: () => void;
};

const BiayaContext = createContext<BiayaContextType | undefined>(undefined);

export function BiayaProvider({ children }: { children: React.ReactNode }) {
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
    <BiayaContext.Provider value={value}>{children}</BiayaContext.Provider>
  );
}

export const useBiaya = () => {
  const context = useContext(BiayaContext);
  if (!context) {
    throw new Error("useBiaya must be used within a BiayaProvider");
  }
  return context;
};
