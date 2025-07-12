"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type PenandatanganContextType = {
  pegawaiAsal: {
    nip: string;
    nama: string;
  }[];
  pegawaiTujuan: {
    nip: string;
    nama: string;
  }[];
  search: string;
  setSearch: (search: string) => void;
};

const PenandatanganContext = createContext<
  PenandatanganContextType | undefined
>(undefined);

export function PenandatanganProvider({
  children,
  kdSatkerAsal,
  kdSatkerTujuan,
}: {
  children: React.ReactNode;
  kdSatkerAsal: string;
  kdSatkerTujuan: string;
}) {
  const [search, setSearch] = useState<string>("");
  const [pegawaiAsal, setPegawaiAsal] = useState<
    {
      nip: string;
      nama: string;
    }[]
  >([]);
  const [pegawaiTujuan, setPegawaiTujuan] = useState<
    {
      nip: string;
      nama: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Mutasi/Referensi/DaftarPegawai?kdSatker=${kdSatkerAsal}`,
        );
        if (!response.ok)
          throw new Error("Gagal mengambil data Pegawai Kantor Asal");
        const { data } = await response.json();
        console.log(data);

        setPegawaiAsal(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [kdSatkerAsal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Mutasi/Referensi/DaftarPegawai?kdSatker=${kdSatkerTujuan}`,
        );
        if (!response.ok)
          throw new Error("Gagal mengambil data Pegawai Kantor Tujuan");
        const { data } = await response.json();
        console.log(data);
        setPegawaiTujuan(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [kdSatkerTujuan]);

  const value = useMemo(
    () => ({
      pegawaiAsal,
      pegawaiTujuan,
      search,
      setSearch,
    }),
    [pegawaiAsal, pegawaiTujuan, search],
  );
  return (
    <PenandatanganContext.Provider value={value}>
      {children}
    </PenandatanganContext.Provider>
  );
}

export const usePenandatangan = () => {
  const context = useContext(PenandatanganContext);
  if (!context) {
    throw new Error(
      "usePenandatangan must be used within a PenandatanganProvider",
    );
  }
  return context;
};
