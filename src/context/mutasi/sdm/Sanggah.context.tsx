"use client";
import { createContext, useState, useContext, useMemo, useEffect } from "react";

type SanggahContextType = {
  refresh: number;
  setRefresh: () => void;
  search: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SanggahContext = createContext<SanggahContextType | undefined>(undefined);

export const SanggahProvider = ({ children }: { children: React.ReactNode }) => {
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

  return <SanggahContext.Provider value={value}>{children}</SanggahContext.Provider>;
};

export const useSanggah = () => {
  const context = useContext(SanggahContext);
  if (!context) {
    throw new Error("useSanggah must be used within a SanggahProvider");
  }
  return context;
};
