"use client";
import { useContext, useEffect } from "react";
import { PaginatorContext } from "@/component/Atoms/PaginatorMain";
import {
  CloseToEnd,
  CloseToStart,
  End,
  Next,
  Previous,
  Small,
  Start,
  Main,
} from "@/component/Atoms/PaginatorComponent";

export default function Paginator({
  onEachSide,
  totalPage,
  page,
  action
}: {
  onEachSide: number;
  totalPage: number;
  page: number;
  action: (page:number) => void
}) {
  const { setCurrentPage, setOnEachSide, setTotalPage } =
    useContext(PaginatorContext);

  useEffect(() => {
    setOnEachSide(onEachSide);
    setTotalPage(totalPage);
  }, [onEachSide, totalPage]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);
  const window = onEachSide + 4;
  return (
    totalPage > 1 &&
    (totalPage <= onEachSide * 2 + 8 ? (
      <div className="flex w-full justify-between px-4 md:justify-center">
        <Previous action={action}/>
        <Small action={action}/>
        <Next action={action}/>
      </div>
    ) : page <= window ? (
      <div className="flex w-full justify-between px-4 md:justify-center">
        <Previous action={action}/>
        <CloseToStart action={action}/>
        <End action={action}/>
        <Next action={action}/>
      </div>
    ) : page > totalPage - window ? (
      <div className="flex w-full justify-between px-4 md:justify-center">
        <Previous action={action}/>
        <Start action={action}/>
        <CloseToEnd action={action}/>
        <Next action={action}/>
      </div>
    ) : (
      <div className="flex w-full justify-between px-4 md:justify-center">
        <Previous action={action}/>
        <Start action={action}/>
        <Main action={action}/>
        <End action={action}/>
        <Next action={action}/>
      </div>
    ))
  );
}
