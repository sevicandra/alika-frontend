"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type PembayaranDetailData = {
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

type PembayaranDetailContextType = {
  data: PembayaranDetailData | undefined;
  setRefresh: () => void;
};

const PembayaranDetailContext = createContext<
  PembayaranDetailContextType | undefined
>(undefined);

export function PembayaranDetailProvider({
  children,
  Pembayaran_id,
  Mutasi_id,
}: {
  children: React.ReactNode;
  Pembayaran_id: string;
  Mutasi_id: string;
}) {
  const [data, setData] = useState<PembayaranDetailData>();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${Mutasi_id}/Pembayaran/${Pembayaran_id}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil data Pembayaran");
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [Pembayaran_id, refresh, Mutasi_id]);

  const value = useMemo(
    () => ({
      data,
      setRefresh: () => setRefresh((prev) => prev + 1),
    }),
    [data],
  );

  return (
    <PembayaranDetailContext.Provider value={value}>
      {children}
    </PembayaranDetailContext.Provider>
  );
}

export const usePembayaranDetail = () => {
  const context = useContext(PembayaranDetailContext);
  if (!context) {
    throw new Error(
      "usePembayaranDetail must be used within a PembayaranDetailProvider",
    );
  }
  return context;
};
