"use client";
import Link from "next/link";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";
export default function Layout({
  children,
  action,
}: {
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  const { totalPage } = usePaginator();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4"></div>
      <div className="max-w-full overflow-x-auto px-4">
        <div className="flex min-w-max justify-start gap-1">
          <Link
            href="/penghasilan/cetak/kp4"
            className="btn btn-xs btn-success"
          >
            KP4
          </Link>
          <Link
            href="/penghasilan/cetak/skp"
            className="btn btn-xs btn-success"
          >
            SKP
          </Link>
          <Link
            href="/penghasilan/cetak/daftar-gaji"
            className="btn btn-xs btn-success"
          >
            Daftar Gaji
          </Link>
          <Link
            href="/penghasilan/cetak/1721-A2"
            className="btn btn-xs btn-success"
          >
            PPh Pasal 21
          </Link>
          <Link
            href="/penghasilan/cetak/1721-VII"
            className="btn btn-xs btn-success"
          >
            PPh Pasal 21 Final
          </Link>
        </div>
      </div>
      <>{children}</>
      <>{action}</>

      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
    </div>
  );
}
