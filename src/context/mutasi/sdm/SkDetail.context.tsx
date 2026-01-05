"use client";
import { createContext, useState, useContext, useEffect } from "react";

type SkDetailData = {
  id: string;
  nomor: string;
  uraian: string;
  tanggal: string;
  tmt: string;
  jenjang: string;
  status: string;
  jumlah_pegawai: number;
  total_biaya: number;
};

type SkDetailContextType = {
  data?: SkDetailData;
  loading: boolean;
  error: string | null;
};

const SkDetailContext = createContext<SkDetailContextType | undefined>(undefined);

export function SkDetailProvider({ children, id }: { children: React.ReactNode; id: string }) {
  const [data, setData] = useState<SkDetailData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`);
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
  }, [id]);

  return (
    <SkDetailContext.Provider value={{ data, loading, error }}>{children}</SkDetailContext.Provider>
  );
}

export function useSkDetail() {
  const context = useContext(SkDetailContext);
  if (!context) {
    throw new Error("useSkDetail harus digunakan di dalam SkDetailProvider");
  }
  return context;
}
