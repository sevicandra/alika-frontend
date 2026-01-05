"use client";
import { useContext, createContext, useState } from "react";

type TabContextType = {
  tab: number;
  setTab: (tab: number) => void;
};

const TabContext = createContext<TabContextType | null>(null);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState(0);
  const contextValue = {
    tab,
    setTab,
  };
  return <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>;
}
export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
}
