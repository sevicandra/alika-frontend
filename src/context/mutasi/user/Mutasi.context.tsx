"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type MutasiContextType = {
  refresh: number;
  setRefresh: () => void;
  search: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const MutasiContext = createContext<MutasiContextType | undefined>(undefined);

export function MutasiProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const setRefresh = () => setRefreshState((prev) => prev + 1);
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const value = useMemo(
    () => ({
      refresh,
      setRefresh,
      search,
      searchTerm,
      setSearchTerm,
    }),
    [refresh, search, searchTerm]
  );
  return (
    <MutasiContext.Provider value={value}>{children}</MutasiContext.Provider>
  );
}

export const useMutasi = () => {
  const context = useContext(MutasiContext);
  if (!context) {
    throw new Error("useMutasi must be used within a MutasiProvider");
  }
  return context;
};
