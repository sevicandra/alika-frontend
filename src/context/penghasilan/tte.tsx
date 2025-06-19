'use client';
import { createContext, useState } from "react";
type TteContextType = {
  refresh: number;
  setRefresh: () => void;
};

export const TteContext = createContext<TteContextType>({
  refresh: 0,
  setRefresh: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [refresh, setRefresh] = useState(0);
  const contextValue = {
    refresh,
    setRefresh: () => setRefresh(refresh + 1),
  };
  return (
    <TteContext.Provider value={contextValue}>
      {children}
    </TteContext.Provider>
  );
}