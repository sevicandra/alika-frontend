"use client";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
type TerminDetailData = {
  id: string;
  ref_termin: string;
  pegawai_id: string;
  tahun: string;
  nominal: number;
  status:
    | "DRAFT"
    | "PENDING"
    | "WAITING_APPROVAL"
    | "WAITING_APPROVAL_SDM"
    | "APPROVED_SDM"
    | "WAITING_APPROVAL_KEU"
    | "APPROVED_KEU"
    | "PAID"
    | "REJECTED";
  admin_notes: string;
  submitted_at: Date | null;
  reviewed_at: Date | null;
  created_at: Date;
  Ref: {
    nama: string;
  };
};

type TerminDetailContextType = {
  data: TerminDetailData | undefined;
  setRefresh: () => void;
};

const TerminDetailContext = createContext<TerminDetailContextType | undefined>(
  undefined,
);

export function TerminDetailProvider({
  children,
  Sk_id,
  Pegawai_id,
  Termin_id,
}: {
  children: React.ReactNode;
  Sk_id: string;
  Pegawai_id: string;
  Termin_id: string;
}) {
  const [data, setData] = useState<TerminDetailData>();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Mutasi/Bendahara/SuratKeputusan/${Sk_id}/Pegawai/${Pegawai_id}/Termin/${Termin_id}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil data Termin");
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [Sk_id, refresh, Pegawai_id, Termin_id]);

  const value = useMemo(
    () => ({
      data,
      setRefresh: () => setRefresh((prev) => prev + 1),
    }),
    [data],
  );

  return (
    <TerminDetailContext.Provider value={value}>
      {children}
    </TerminDetailContext.Provider>
  );
}

export const useTerminDetail = () => {
  const context = useContext(TerminDetailContext);
  if (!context) {
    throw new Error(
      "useTerminDetail must be used within a TerminDetailProvider",
    );
  }
  return context;
};
