"use client";
import { createContext, useState, useContext, useMemo, useEffect } from "react";

type TableContextType = {
  refresh: number;
  setRefresh: () => void;
  filter: { [key: string]: string };
  setFilter: (filter: { [key: string]: string }) => void;
  searchs: { [key: string]: string };
  setSearchs: (searchs: { [key: string]: string }) => void;
  searchsTerm: { [key: string]: string };
  setSearchsTerm: (searchsTerm: { [key: string]: string }) => void;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefreshState] = useState(0);
  const [filter, setFilterState] = useState<{ [key: string]: string }>({});
  const [searchs, setSearchs] = useState<{ [key: string]: string }>({});
  const [searchsTerm, setSearchsTerm] = useState<{
    [key: string]: string;
  }>({});
  const setRefresh = () => setRefreshState((prev) => prev + 1);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Object.keys(searchsTerm).length > 0) setSearchs(searchsTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchsTerm]);

  const value = useMemo(
    () => ({
      refresh,
      setRefresh,
      filter,
      setFilter: setFilterState,
      searchs,
      setSearchs,
      searchsTerm,
      setSearchsTerm,
    }),
    [refresh, filter, searchs, searchsTerm],
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};
