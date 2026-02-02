"use client";
import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

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

const PaginatorContext = createContext<PaginatorContextType | undefined>(
  undefined,
);

export function PaginatorProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [onEachSide, setOnEachSide] = useState(2);

  const setCurrentPage = useCallback(
    (page: number) => {
      if (page > totalPage) {
        setPage(totalPage);
      } else if (page < 1) {
        setPage(1);
      } else {
        setPage(page);
      }
    },
    [totalPage],
  );

  const setCurrentTotalPage = useCallback((totalPage: number) => {
    if (totalPage < 1) {
      setTotalPage(1);
    } else {
      setTotalPage(totalPage);
    }
  }, []);

  if (page > totalPage) {
    setPage(totalPage);
  }

  const value = useMemo(
    () => ({
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
    }),
    [limit, onEachSide, page, totalPage, setCurrentPage, setCurrentTotalPage],
  );

  return (
    <PaginatorContext.Provider value={value}>
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
