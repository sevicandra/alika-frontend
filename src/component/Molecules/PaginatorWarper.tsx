"use client";
import { usePaginator } from "@/context/paginator";
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
  action,
}: {
  onEachSide: number;
  totalPage: number;
  page: number;
  action: (page: number) => void;
}) {
  const { limit, setLimit } = usePaginator();

  const window = onEachSide + 4;
  return (
    <div className="grid w-full grid-cols-2 md:grid-cols-[auto_1fr_auto] items-center px-2">
      <div className="flex items-center gap-1 text-nowrap">
        <p>items :</p>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="select select-xs w-fit focus:outline-none"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>
      <div className="hidden md:block">
        {totalPage > 1 &&
          (totalPage <= onEachSide * 2 + 8 ? (
            <div className="gap-1 flex w-full justify-between px-4 md:justify-center">
              <Small action={action} />
            </div>
          ) : page <= window ? (
            <div className="gap-1 flex w-full justify-between px-4 md:justify-center">
              <CloseToStart action={action} />
              <End action={action} />
            </div>
          ) : page > totalPage - window ? (
            <div className="gap-1 flex w-full justify-between px-4 md:justify-center">
              <Start action={action} />
              <CloseToEnd action={action} />
            </div>
          ) : (
            <div className="gap-1 flex w-full justify-between px-4 md:justify-center">
              <Start action={action} />
              <Main action={action} />
              <End action={action} />
            </div>
          ))}
      </div>
      <div className="flex gap-1 justify-end">
        <Previous action={action} />
        <Next action={action} />
      </div>
    </div>
  );
}
