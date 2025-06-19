"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";

type ReferensiHubunganKeluarga = {
  kode: string;
  nama: string;
};

type RevisiAdd = {
  action: "add";
  nama: string;
  data: {
    nama: {
      new: string;
    };
    nik: {
      new: string;
    };
    hubungan: {
      new: string;
    };
    tanggal_lahir: {
      new: string;
    };
    pekerjaan: {
      new: string;
    };
    status: {
      new: string;
    };
  };
  catatan: string;
  file: File;
};

type RevisiEdit = {
  id: string;
  action: "edit";
  nama: string;
  data: {
    nama?: {
      old: string | undefined;
      new: string;
    };
    nik?: {
      old: string | undefined;
      new: string;
    };
    hubungan?: {
      old: string | undefined;
      new: string;
    };
    tanggal_lahir?: {
      old: string | undefined;
      new: string;
    };
    pekerjaan?: {
      old: string | undefined;
      new: string;
    };
    status?: {
      old: string | undefined;
      new: string;
    };
  };
  catatan: string;
  file?: File;
};

type RevisiRemove = {
  id: string;
  nama: string;
  action: "remove";
  catatan: string;
};

type Revisi = RevisiAdd | RevisiEdit | RevisiRemove;

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
  revisi: Revisi[];
  dataKeluarga: dataKeluarga[];
  form: "add" | "edit" | "remove";
  addRevisi: (revisi: Revisi) => void;
  deleteRevisi: (index: number) => void;
  setForm: (form: "add" | "edit" | "remove") => void;
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
  const [revisi, setRevisi] = useState<Revisi[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [form, setForm] = useState<"add" | "edit" | "remove">("add");

  const addRevisi = (revisi: Revisi) => {
    setRevisi((prevRevisi) => [...prevRevisi, revisi]);
  };

  const deleteRevisi = (index: number) => {
    setRevisi((prevRevisi) => prevRevisi.filter((_, i) => i !== index));
  };

  const value = useMemo(
    () => ({
      referensiHubungan,
      revisi,
      dataKeluarga,
      addRevisi,
      deleteRevisi,
      form,
      setForm,
    }),
    [referensiHubungan, revisi, dataKeluarga, form],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Mutasi/Referensi/HubunganKeluarga");
        if (!response.ok)
          throw new Error("Gagal mengambil referensi hubungan keluarga");
        const { data } = await response.json();
        setReferensiHubungan(data);
      } catch (error) {
        console.error(error);
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
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setDataKeluarga(data);
      } catch (error) {
        setError(error as Error);
      }
    };
    fetchData();
  }, []);

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
