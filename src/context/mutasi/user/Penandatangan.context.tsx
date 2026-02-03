"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
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
  const { addNotification } = useNotification();
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
        const res = await fetch(
          `/api/Mutasi/Referensi/DaftarPegawai?kdSatker=${kdSatkerAsal}`,
        );
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setPegawaiAsal(
          data.filter(
            (d: { nama: string; nip: string; jenisJabatan: string }) =>
              d.jenisJabatan.toLowerCase() === "struktural",
          ),
        );
      } catch (error) {
        addNotification({
          variant: "error",
          title: "Fetch Data Pegawai Kantor Asal",
          message: (error as Error).message,
        });
      }
    };
    fetchData();
  }, [kdSatkerAsal, addNotification]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/Mutasi/Referensi/DaftarPegawai?kdSatker=${kdSatkerTujuan}`,
        );
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setPegawaiTujuan(
          data.filter(
            (d: { nama: string; nip: string; jenisJabatan: string }) =>
              d.jenisJabatan.toLowerCase() === "struktural",
          ),
        );
      } catch (error) {
        addNotification({
          variant: "error",
          title: "Fetch Data Pegawai Kantor Asal",
          message: (error as Error).message,
        });
      }
    };
    fetchData();
  }, [kdSatkerTujuan, addNotification]);

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
