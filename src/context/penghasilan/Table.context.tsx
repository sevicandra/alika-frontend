"use client";
import { createContext, useState, useContext } from "react";
type CetakContextType = {
  refresh: number;
  setRefresh: () => void;
};

const CetakContext = createContext<CetakContextType | undefined>(undefined);

export default function TableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

export const useTable = () => {
  const context = useContext(CetakContext);
  if (!context) {
    throw new Error(
      "useTable must be used within a TableProvider",
    );
  }
  return context;
};
