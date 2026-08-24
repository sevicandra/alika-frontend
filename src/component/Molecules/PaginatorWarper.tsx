"use client";
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

// ────────────────────────────────────────────────────────────
// PAGINATOR WRAPPER — Molecule
// Presentational: menerima semua data via props.
// Context dependency (usePaginator) telah dipindahkan ke
// Organisms/Paginator yang membungkus komponen ini.
// ────────────────────────────────────────────────────────────
export default function PaginatorWrapper({
  onEachSide,
  totalPage,
  page,
  action,
  limit,
  setLimit,
}: {
  onEachSide: number;
  totalPage: number;
  page: number;
  action: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}) {
  const window = onEachSide + 4;

  return (
    <div className="grid w-full grid-cols-2 items-center px-2 md:grid-cols-[auto_1fr_auto]">
      <div className="flex items-center gap-1 text-nowrap">
        <p>items :</p>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="select w-fit select-xs focus:outline-none"
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
            <div className="flex w-full justify-between gap-1 px-4 md:justify-center">
              <Small action={action} currentPage={page} totalPage={totalPage} />
            </div>
          ) : page <= window ? (
            <div className="flex w-full justify-between gap-1 px-4 md:justify-center">
              <CloseToStart action={action} currentPage={page} onEachSide={onEachSide} />
              <End action={action} totalPage={totalPage} />
            </div>
          ) : page > totalPage - window ? (
            <div className="flex w-full justify-between gap-1 px-4 md:justify-center">
              <Start action={action} />
              <CloseToEnd action={action} currentPage={page} totalPage={totalPage} onEachSide={onEachSide} />
            </div>
          ) : (
            <div className="flex w-full justify-between gap-1 px-4 md:justify-center">
              <Start action={action} />
              <Main action={action} currentPage={page} onEachSide={onEachSide} />
              <End action={action} totalPage={totalPage} />
            </div>
          ))}
      </div>
      <div className="flex justify-end gap-1">
        <Previous action={action} currentPage={page} />
        <Next action={action} currentPage={page} totalPage={totalPage} />
      </div>
    </div>
  );
}
