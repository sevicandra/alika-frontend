"use client";
import { createContext, useState } from "react";
type CetakDocContextType = {
  tahun: number;
  bulan: number;
  setTahun: (tahun: number) => void;
  setBulan: (bulan: number) => void;
  setLoading: (loading: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
};

export const CetakDocContext = createContext<CetakDocContextType>({
  tahun: new Date().getFullYear(),
  bulan: new Date().getMonth() + 1,
  setTahun: () => {},
  setBulan: () => {},
  setLoading: () => {},
  open: false,
  setOpen: () => {},
  loading: false,
});

export default function useCetakDocContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataBulan, setBulan] = useState(new Date().getMonth() + 1);
  const [dataTahun, setTahun] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const contextValue = {
    tahun: dataTahun,
    bulan: dataBulan,
    loading,
    setTahun,
    setBulan,
    setLoading,
    open,
    setOpen,
  };
  return (
    <CetakDocContext.Provider value={contextValue}>
      {children}
    </CetakDocContext.Provider>
  );
}
