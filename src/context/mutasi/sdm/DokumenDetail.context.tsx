"use client";
import { createContext, useState, useContext, useEffect } from "react";

type DokumenDetailAttributes = {
  id: string;
  ticket_number: string;
  submitted_at: string;
  status: string;
  Pegawai: {
    nama: string;
    nip: string;
  };
};

type DokumenDetailContextType = {
  data?: DokumenDetailAttributes;
  loading: boolean;
  error: string | null;
  setRefresh: () => void;
};

const DokumenDetailContext = createContext<DokumenDetailContextType | undefined>(undefined);

export function DokumenDetailProvider({ children, id }: { children: React.ReactNode; id: string }) {
  const [data, setData] = useState<DokumenDetailAttributes>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefreshState] = useState(0);

  const setRefresh = () => {
    setRefreshState((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/Mutasi/SDM/Dokumen/${id}`);
        if (!response.ok) throw new Error("Gagal mengambil data SK");
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, refresh]);

  return (
    <DokumenDetailContext.Provider value={{ data, loading, error, setRefresh }}>
      {children}
    </DokumenDetailContext.Provider>
  );
}

export function useDokumenDetail() {
  const context = useContext(DokumenDetailContext);
  if (!context) {
    throw new Error("DokumenDetail harus digunakan di dalam SanggahDetailProvider");
  }
  return context;
}
