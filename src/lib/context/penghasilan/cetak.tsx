"use client";
import { createContext, useState } from "react";
type CetakContextType = {
  refresh: number;
  setRefresh: () => void;
};

export const CetakContext = createContext<CetakContextType>({
  refresh: 0,
  setRefresh: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [refresh, setRefresh] = useState(0);
  const contextValue = {
    refresh,
    setRefresh: () => setRefresh(refresh + 1),
  };
  return (
    <CetakContext.Provider value={contextValue}>
      {children}
    </CetakContext.Provider>
  );
}
