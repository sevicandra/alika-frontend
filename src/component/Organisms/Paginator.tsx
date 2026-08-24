"use client";
import Wrapper from "../Molecules/PaginatorWarper";
import { usePaginator } from "@/context/paginator";

// ────────────────────────────────────────────────────────────
// PAGINATOR — Organism
// Satu-satunya tempat yang mengonsumsi usePaginator() context.
// Bertugas mengambil semua state paginator dan melemparkannya
// ke Molecule PaginatorWarper sebagai props eksplisit.
// ────────────────────────────────────────────────────────────
export default function Paginator() {
  const { totalPage, page, setPage, limit, setLimit } = usePaginator();
  return (
    <Wrapper
      totalPage={totalPage}
      page={page}
      onEachSide={3}
      action={setPage}
      limit={limit}
      setLimit={setLimit}
    />
  );
}
