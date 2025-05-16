"use client";
import { createContext, useState } from "react";
type PaginatorContextType = {
  currentPage: number;
  setCurrentPage: (number: number) => void;
  totalPage: number;
  setTotalPage: (number: number) => void;
  onEachSide: number;
  setOnEachSide: (number: number) => void;
};

export const PaginatorContext = createContext<PaginatorContextType>({
  currentPage: 1,
  totalPage: 1,
  onEachSide: 3,
  setCurrentPage: () => {},
  setTotalPage: () => {},
  setOnEachSide: () => {},
});

export default function Paginator({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [onEachSide, setOnEachSide] = useState(3);

  const contextValue = {
    currentPage,
    setCurrentPage(page: number) {
      setCurrentPage(page);
    },
    totalPage,
    onEachSide,
    setTotalPage(page: number) {
      setTotalPage(page);
    },
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
