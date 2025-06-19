"use client";
import { createContext, useState, useContext, useMemo, useEffect } from "react";

type SkContextType = {
  refresh: number;
  setRefresh: () => void;
  jenjang: string | null;
  status: string | null;
  search: string;
  searchTerm: string;
  setJenjang: (jenjang: string | null) => void;
  setStatus: (status: string | null) => void;
  setSearchTerm: (term: string) => void;
};

const SkContext = createContext<SkContextType | undefined>(undefined);

export const SkProvider = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefreshState] = useState(0);
  const [jenjang, setJenjang] = useState<string | null>(null);
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
      jenjang,
      status,
      search,
      searchTerm,
      setJenjang,
      setStatus,
      setSearchTerm,
    }),
    [refresh, jenjang, status, search, searchTerm]
  );

  return <SkContext.Provider value={value}>{children}</SkContext.Provider>;
};

export const useSk = () => {
  const context = useContext(SkContext);
  if (!context) {
    throw new Error("useSk must be used within a SkProvider");
  }
  return context;
};
