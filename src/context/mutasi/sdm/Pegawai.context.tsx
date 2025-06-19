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
  dataKeluarga: string | null;
  dataBiaya: string | null;
  dataTermin: string | null;
  setDataKeluarga: (data: string | null) => void;
  setDataBiaya: (data: string | null) => void;
  setDataTermin: (data: string | null) => void;
};

const PegawaiContext = createContext<PegawaiContextType | undefined>(undefined);

export function PegawaiProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [dataKeluarga, setDataKeluarga] = useState<string | null>(null);
  const [dataBiaya, setDataBiaya] = useState<string | null>(null);
  const [dataTermin, setDataTermin] = useState<string | null>(null);
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
      dataKeluarga,
      dataBiaya,
      dataTermin,
      setDataKeluarga,
      setDataBiaya,
      setDataTermin,
    }),
    [refresh, status, search, dataKeluarga, dataBiaya, searchTerm, dataTermin]
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
