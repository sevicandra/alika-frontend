"use client";
import { createContext, useState, useContext, useEffect } from "react";

type PegawaiDetailData = {
  id: string;
  sk_id: string;
  kantor_asal: string;
  kantor_tujuan: string;
  nip: string;
  nama: string;
  golongan: string;
  process_keluarga: string;
  process_biaya: string;
  process_termin: string;
  status: string;
  MonitoringTagihan: {
    total_tagihan: number;
    total_termin: number;
    sisa_tagihan: number;
  };
};

type PegawaiDetailContextType = {
  data?: PegawaiDetailData;
  loading: boolean;
  error: string | null;
  setRefresh: () => void;
};

const PegawaiDetailContext = createContext<
  PegawaiDetailContextType | undefined
>(undefined);

export function PegawaiDetailProvider({
  children,
  id,
  pegawai_id,
}: {
  children: React.ReactNode;
  id: string;
  pegawai_id: string;
}) {
  const [data, setData] = useState<PegawaiDetailData>();
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
        const response = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}`,
        );
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
  }, [id, pegawai_id, refresh]);

  return (
    <PegawaiDetailContext.Provider value={{ data, loading, error, setRefresh }}>
      {children}
    </PegawaiDetailContext.Provider>
  );
}

export function usePegawaiDetail() {
  const context = useContext(PegawaiDetailContext);
  if (!context) {
    throw new Error(
      "PegawaiDetail harus digunakan di dalam PegawaiDetailProvider",
    );
  }
  return context;
}
