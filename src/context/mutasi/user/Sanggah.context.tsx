"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";

type ReferensiHubunganKeluarga = {
  kode: string;
  nama: string;
};
type dataKeluarga = {
  id: string;
  nik: string;
  nama: string;
  hubungan: string;
  tanggal_lahir: string;
  pekerjaan: string;
  is_invant: boolean;
  status: string;
  Ref: {
    kode: string;
    nama: string;
  };
};
type SanggahContextType = {
  referensiHubungan: ReferensiHubunganKeluarga[];
  dataKeluarga: dataKeluarga[];
};

const SanggahContext = createContext<SanggahContextType | null>(null);

export function SanggahProvider({
  children,
  mutasi_id,
}: {
  children: React.ReactNode;
  mutasi_id: string;
}) {
  const [referensiHubungan, setReferensiHubungan] = useState<
    ReferensiHubunganKeluarga[]
  >([]);
  const [dataKeluarga, setDataKeluarga] = useState<dataKeluarga[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();

  const value = useMemo(
    () => ({
      referensiHubungan,
      dataKeluarga,
    }),
    [referensiHubungan, dataKeluarga],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/Mutasi/Referensi/HubunganKeluarga");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(
            error.message || "Gagal mengambil referensi hubungan keluarga",
          );
        }
        const { data } = await res.json();
        setReferensiHubungan(
          data
            .filter(
              (d: any) =>
                d.jenis === "PASANGAN" || d.jenis === "ANAK" || d.kode === 99,
            )
            .sort((a: any, b: any) => {
              const getPriority = (d: any) => {
                if (d.jenis === "PASANGAN") return 0;
                if (d.jenis === "ANAK") return 1;
                if (d.kode === 99) return 2;
                return 3;
              };
              return getPriority(a) - getPriority(b);
            }),
        );
      } catch (error) {
        addNotification({
          variant: "error",
          title: "Gagal mengambil referensi hubungan keluarga",
          message: (error as Error).message,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Keluarga`,
        );
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error.message);
        }
        const { data } = await res.json();
        setDataKeluarga(data);
      } catch (error) {
        setError(error as Error);
      }
    };
    fetchData();
  }, [mutasi_id]);

  if (error) throw error;

  return (
    <SanggahContext.Provider value={value}>{children}</SanggahContext.Provider>
  );
}

export function useSanggahContext() {
  const context = useContext(SanggahContext);
  if (!context) {
    throw new Error("useSanggahContext must be used within a SanggahProvider");
  }
  return context;
}
