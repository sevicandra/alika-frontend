"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";

type TahunContextType = {
  tahun: number;
  setTahun: (tahun: number) => void;
  tahuns: string[];
  loading: boolean;
};

const TahunContext = createContext<TahunContextType | undefined>(undefined);

export function TahunProvider({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotification();
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tahuns, setTahuns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Penghasilan/Gaji/Tahun", {
          method: "GET",
        });
        const { data, error } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        data.sort((a: { tahun: number }, b: { tahun: number }) => {
          return b?.tahun - a?.tahun;
        });
        if (data[0]) {
          while (data[0]?.tahun != new Date().getFullYear()) {
            data.unshift({ tahun: `${Number(data[0].tahun) + 1}` });
          }
          setTahuns(data);
        } else {
          data.unshift({ tahun: `${new Date().getFullYear()}` });
          setTahuns(data);
        }
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: `Tahun`,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification]);

  const contextValue = {
    tahun,
    setTahun,
    tahuns,
    loading,
  };
  return (
    <TahunContext.Provider value={contextValue}>
      {children}
    </TahunContext.Provider>
  );
}

export const useTahun = () => {
  const context = useContext(TahunContext);
  if (!context) {
    throw new Error("useTahun must be used within a TahunProvider");
  }
  return context;
};
