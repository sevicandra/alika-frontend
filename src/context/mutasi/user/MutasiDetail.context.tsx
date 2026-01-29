"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";

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

const MutasiDetailContext = createContext<MutasiDetailContextType | undefined>(
  undefined,
);

export function MutasiDetailProvider({
  children,
  mutasi_id,
}: {
  children: React.ReactNode;
  mutasi_id: string;
}) {
  const [data, setData] = useState<MutasiDetailData>();
  const [refresh, setRefresh] = useState(0);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Mutasi/Pegawai/Mutasi/${mutasi_id}`);
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Gagal mengambil data Mutasi");
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          variant: "error",
          title: "Gagal mengambil data Mutasi",
          message: (error as Error).message,
        });
      }
    };
    fetchData();
  }, [mutasi_id, refresh]);

  const value = useMemo(
    () => ({
      data,
      setRefresh: () => setRefresh((prev) => prev + 1),
    }),
    [data],
  );

  return (
    <MutasiDetailContext.Provider value={value}>
      {children}
    </MutasiDetailContext.Provider>
  );
}

export const useMutasiDetail = () => {
  const context = useContext(MutasiDetailContext);
  if (!context) {
    throw new Error(
      "useMutasiDetail must be used within a MutasiDetailProvider",
    );
  }
  return context;
};
