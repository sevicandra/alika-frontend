"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type MutasiDetailData = {
  id: string;
  sk_id: string;
  kantor_asal: string;
  kantor_tujuan: string;
  nip: string;
  nama: string;
  golongan: string;
  status: string;
  SuratKeputusan: {
    nomor: string;
    tanggal: string;
    status: string;
  };
  CurrentSanggah?: {
    id: string;
  };
};

type MutasiDetailContextType = {
  data: MutasiDetailData | undefined;
  setRefresh: () => void;
};

const MutasiDetailContext = createContext<MutasiDetailContextType | undefined>(undefined);

export function MutasiDetailProvider({
  children,
  mutasi_id,
}: {
  children: React.ReactNode;
  mutasi_id: string;
}) {
  const [data, setData] = useState<MutasiDetailData>();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/Mutasi/Pegawai/Mutasi/${mutasi_id}`);
        if (!response.ok) throw new Error("Gagal mengambil data Mutasi");
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [mutasi_id, refresh]);

  const value = useMemo(
    () => ({
      data,
      setRefresh: () => setRefresh((prev) => prev + 1),
    }),
    [data]
  );

  return <MutasiDetailContext.Provider value={value}>{children}</MutasiDetailContext.Provider>;
}

export const useMutasiDetail = () => {
  const context = useContext(MutasiDetailContext);
  if (!context) {
    throw new Error("useMutasiDetail must be used within a MutasiDetailProvider");
  }
  return context;
};
