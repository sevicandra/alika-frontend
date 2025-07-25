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
  MonitoringTagihan: {
    total_tagihan: number;
    total_termin: number;
    sisa_tagihan: number;
  };
};

type PegawaiDetailContextType = {
  data?: PegawaiDetailData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/Mutasi/Keuangan/SuratKeputusan/${id}/Pegawai/${pegawai_id}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil data SK");
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        setError(
          new Error(error instanceof Error ? error.message : "Unknown error"),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, pegawai_id]);

  return (
    <PegawaiDetailContext.Provider
      value={{ data, loading, error, setLoading, setError }}
    >
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
