"use client";
import { use } from "react";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useMutasiDetail } from "@/context/mutasi/user";
import Paginator from "@/component/Organisms/Paginator";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";

export default function Layout({
  children,
  action,
  params,
}: {
  children: React.ReactNode;
  action: React.ReactNode;
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { mutasi_id } = use(params);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: mutasi } = useMutasiDetail();
  const { totalPage } = usePaginator();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "mutasi") {
              return {
                name: mutasi?.SuratKeputusan
                  ? mutasi.SuratKeputusan.nomor.toLocaleUpperCase()
                  : "Surat Keputusan",
              };
            }
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/mutasi/user/${pathSegments.slice(0, index + 1).join("/")}`,
            };
          })}
          renderRow={(row, index) => (
            <li key={index}>
              {row.href ? (
                <Link href={row.href}>{row.name}</Link>
              ) : (
                <span>{row.name}</span>
              )}
            </li>
          )}
        />
      </div>
      <div className="max-w-full overflow-x-auto px-4">
        {!mutasi?.CurrentSanggah && (
          <div className="flex min-w-max justify-end gap-1">
            <Link
              href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/sanggah/form`}
              className="btn btn-xs btn-success"
            >
              Input Data
            </Link>
            <Link
              href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/sanggah/kirim`}
              className="btn btn-xs btn-success"
            >
              Kirim
            </Link>
          </div>
        )}
      </div>
      <>{children}</>
      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
      <>{action}</>
    </div>
  );
}
