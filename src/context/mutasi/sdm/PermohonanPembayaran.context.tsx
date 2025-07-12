"use client";
import { createContext, useState, useContext, useMemo, useEffect } from "react";

type PermohonanPembayaranContextType = {
  refresh: number;
  setRefresh: () => void;
  search: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const PermohonanPembayaranContext = createContext<PermohonanPembayaranContextType | undefined>(undefined);

export const PermohonanPembayaranProvider = ({ children }: { children: React.ReactNode }) => {
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

  return <PermohonanPembayaranContext.Provider value={value}>{children}</PermohonanPembayaranContext.Provider>;
};

export const usePermohonanPembayaran = () => {
  const context = useContext(PermohonanPembayaranContext);
  if (!context) {
    throw new Error("usePermohonanPembayaran must be used within a PermohonanPembayaranProvider");
  }
  return context;
};
