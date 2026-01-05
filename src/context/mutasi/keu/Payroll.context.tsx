"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type PayrollContextType = {
  termin: {
    id: string;
    nominal: number;
    nama: string;
    nip: string;
  }[];
  tanggal: Date;
  setTanggal: (tanggal: Date) => void;
  refresh: number;
  setRefresh: () => void;
  addTerminId: (id: string, nominal: number, nama: string, nip: string) => void;
  removeTerminId: (id: string) => void;
  search: string;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  status: string;
  setStatus: (status: string) => void;
  tahap: string;
  setTahap: (tahap: string) => void;
};

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export function PayrollProvider({ children }: { children: React.ReactNode }) {
  const [refresh, setRefreshState] = useState(0);
  const [termin, setTermin] = useState<
    {
      id: string;
      nominal: number;
      nama: string;
      nip: string;
    }[]
  >([]);
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [tahap, setTahap] = useState<string>("");
  const setRefresh = () => {
    setRefreshState((prev) => prev + 1);
    setTermin([]);
    setTanggal(new Date());
    setSearch("");
    setSearchTerm("");
    setStatus("");
    setTahap("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const addTerminId = (id: string, nominal: number, nama: string, nip: string) => {
    setTermin((prev) => {
      const existing = prev.find((terminId) => terminId.id === id);
      if (existing) {
        return prev.map((terminId) =>
          terminId.id === id ? { ...terminId, nominal, nama, nip } : terminId
        );
      }
      return [...prev, { id, nominal, nama, nip }];
    });
  };

  const removeTerminId = (id: string) => {
    setTermin((prev) => prev.filter((terminId) => terminId.id !== id));
  };

  const value = useMemo(
    () => ({
      termin,
      tanggal,
      setTanggal,
      refresh,
      setRefresh,
      addTerminId,
      removeTerminId,
      search,
      searchTerm,
      setSearchTerm,
      status,
      setStatus,
      tahap,
      setTahap,
    }),
    [refresh, termin, tanggal, search, searchTerm, status, tahap]
  );
  return <PayrollContext.Provider value={value}>{children}</PayrollContext.Provider>;
}

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error("usePayroll must be used within a PayrollProvider");
  }
  return context;
};
