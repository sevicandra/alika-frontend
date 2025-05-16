"use client";
import { createContext, useState } from "react";

type PaginatorContextType = {
  page: number;
  limit: number;
  totalPage: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotalPage: (totalPage: number) => void;
};

export const PaginatorContext = createContext<PaginatorContextType>({
  page: 1,
  setPage: () => {},
  limit: 10,
  setLimit: () => {},
  totalPage: 1,
  setTotalPage: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

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
  const contextValue = {
    page,
    setPage: setCurrentPage,
    limit,
    setLimit,
    totalPage,
    setTotalPage: setCurrentTotalPage,
  };

  return (
    <PaginatorContext.Provider value={contextValue}>
      {children}
    </PaginatorContext.Provider>
  );
}
