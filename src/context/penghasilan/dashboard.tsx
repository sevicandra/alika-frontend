"use client";
import { createContext, useState } from "react";

type DashboardContextType = {
  tahun: number;
  setTahun: (tahun: number) => void;
};

export const DashboardContext = createContext<DashboardContextType>({
  tahun: new Date().getFullYear(),
  setTahun: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const contextValue = {
    tahun,
    setTahun,
  };
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
