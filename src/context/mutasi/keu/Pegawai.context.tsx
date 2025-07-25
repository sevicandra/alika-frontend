"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type PegawaiContextType = {
  refresh: number;
  setRefresh: () => void;
  status: string | null;
  search: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setStatus: (status: string | null) => void;
};

const PegawaiContext = createContext<PegawaiContextType | undefined>(undefined);

export function PegawaiProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
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
      status,
      search,
      searchTerm,
      setStatus,
      setSearchTerm,
    }),
    [refresh, status, search, searchTerm],
  );
  return (
    <PegawaiContext.Provider value={value}>{children}</PegawaiContext.Provider>
  );
}

export const usePegawai = () => {
  const context = useContext(PegawaiContext);
  if (!context) {
    throw new Error("usePegawai must be used within a PegawaiProvider");
  }
  return context;
};
