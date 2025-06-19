"use client";
import { createContext, useState, useEffect, useContext } from "react";

type PaginatorContextType = {
  page: number;
  limit: number;
  totalPage: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotalPage: (totalPage: number) => void;
  onEachSide: number;
  setOnEachSide: (onEachSide: number) => void;
};

export const PaginatorContext = createContext<PaginatorContextType>({
  page: 1,
  setPage: () => {},
  limit: 10,
  setLimit: () => {},
  totalPage: 1,
  setTotalPage: () => {},
  onEachSide: 2,
  setOnEachSide: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [onEachSide, setOnEachSide] = useState(2);

  const setCurrentPage = (page: number) => {
    if (page > totalPage) {
      setPage(totalPage);
      return;
    }
    if (page < 1) {
      setPage(1);
      return;
    }
    setPage(page);
  };

  const setCurrentTotalPage = (totalPage: number) => {
    if (totalPage < 1) {
      setTotalPage(1);
      return;
    }
    setTotalPage(totalPage);
  };

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage);
    }
  }, [totalPage]);

  const contextValue = {
    page,
    setPage: setCurrentPage,
    limit,
    setLimit,
    totalPage,
    setTotalPage: setCurrentTotalPage,
    onEachSide,
    setOnEachSide(page: number) {
      setOnEachSide(page);
    },
  };

  return (
    <PaginatorContext.Provider value={contextValue}>
      {children}
    </PaginatorContext.Provider>
  );
}

export function usePaginator() {
  const context = useContext(PaginatorContext);
  if (context === undefined) {
    throw new Error("usePaginator must be used within a PaginatorProvider");
  }
  return context;
}
