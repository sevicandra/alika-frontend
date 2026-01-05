"use client";
import { createContext, useState, useContext, useEffect } from "react";

type SanggahDetailAttributes = {
  id: string;
  ticket_number: string;
  submitted_at: string;
  status: string;
  Pegawai: {
    nama: string;
    nip: string;
  };
};

type SanggahDetailContextType = {
  data?: SanggahDetailAttributes;
  loading: boolean;
  error: string | null;
  setRefresh: () => void;
};

const SanggahDetailContext = createContext<SanggahDetailContextType | undefined>(undefined);

export function SanggahDetailProvider({ children, id }: { children: React.ReactNode; id: string }) {
  const [data, setData] = useState<SanggahDetailAttributes>();
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
        const response = await fetch(`/api/Mutasi/SDM/Sanggah/${id}`);
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
    <SanggahDetailContext.Provider value={{ data, loading, error, setRefresh }}>
      {children}
    </SanggahDetailContext.Provider>
  );
}

export function useSanggahDetail() {
  const context = useContext(SanggahDetailContext);
  if (!context) {
    throw new Error("SanggahDetail harus digunakan di dalam SanggahDetailProvider");
  }
  return context;
}
