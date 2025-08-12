"use client";
import { createContext, useState, useContext } from "react";
type CetakContextType = {
  tahun: string | undefined;
  bulan: string;
  setTahun: (tahun: string) => void;
  setBulan: (bulan: string) => void;
  setLoading: (loading: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
};

const CetakContext = createContext<CetakContextType | undefined>(
  undefined,
);

export function CetakProvider({ children }: { children: React.ReactNode }) {
  const [dataBulan, setBulan] = useState(`${new Date().getMonth() + 1}`);
  const [dataTahun, setTahun] = useState<string | undefined>();
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
    <CetakContext.Provider value={contextValue}>
      {children}
    </CetakContext.Provider>
  );
}

export const useCetak = () => {
  const context = useContext(CetakContext);
  if (!context) {
    throw new Error(
      "useCetakDoc must be used within a CetakContextProvider",
    );
  }
  return context;
};
