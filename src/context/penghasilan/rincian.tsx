"use client";
import { createContext, useState } from "react";

type RincianContextType = {
  tahun: number;
  setTahun: (tahun: number) => void;
};

export const RincianContext = createContext<RincianContextType>({
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
    <RincianContext.Provider value={contextValue}>
      {children}
    </RincianContext.Provider>
  );
}
