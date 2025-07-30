"use client";
import { createContext, useState, useContext, useMemo, useEffect } from "react";

type TableContextType = {
  refresh: number;
  setRefresh: () => void;
  filter: { [key: string]: any };
  setFilter: (filter: { [key: string]: any }) => void;
  searchParams: { [key: string]: any };
  setSearchParams: (searchParams: { [key: string]: any }) => void;
  searchParamsTerm: { [key: string]: any };
  setSearchParamsTerm: (searchParamsTerm: { [key: string]: any }) => void;
  getFilter: (key: string) => any;
  getSearchParams: (key: string) => any;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefreshState] = useState(0);
  const [filter, setFilterState] = useState<{ [key: string]: any }>({});
  const [searchParams, setSearchParams] = useState<{ [key: string]: any }>({});
  const [searchParamsTerm, setSearchParamsTerm] = useState<{
    [key: string]: any;
  }>({});
  const setRefresh = () => setRefreshState((prev) => prev + 1);
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(searchParamsTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchParamsTerm]);
  const getFilter = (key: string) => {
    return filter.hasOwnProperty(key) ? filter[key] : null;
  };

  const getSearchParams = (key: string) => {
    return searchParams.hasOwnProperty(key) ? searchParams[key] : null;
  };

  const value = useMemo(
    () => ({
      refresh,
      setRefresh,
      filter,
      setFilter: setFilterState,
      searchParams,
      setSearchParams,
      searchParamsTerm,
      setSearchParamsTerm,
      getFilter,
      getSearchParams,
    }),
    [refresh, filter, searchParams, searchParamsTerm],
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
