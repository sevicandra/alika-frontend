"use client";
import Warper from "../Molecules/PaginatorWarper";
import { usePaginator } from "@/context/paginator";

export default function Paginator() {
  const { totalPage, page, setPage } = usePaginator();
  return (
    <Warper totalPage={totalPage} page={page} onEachSide={3} action={setPage} />
  );
}
