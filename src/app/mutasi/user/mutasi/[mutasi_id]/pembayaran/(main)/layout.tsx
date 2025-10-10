"use client";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useMutasiDetail } from "@/context/mutasi/user";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const pathname = usePathname();
  const { totalPage } = usePaginator();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: mutasi } = useMutasiDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4  overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "mutasi") {
              return {
                name: mutasi ? mutasi.SuratKeputusan.nomor : "Surat Keputusan",
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
                <span className="hover:cursor-not-allowed">{row.name}</span>
              )}
            </li>
          )}
        />
      </div>
      <div className="max-w-full overflow-x-auto px-4">
        <div className="flex min-w-max justify-end gap-1"></div>
      </div>

      {children}
      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
    </div>
  );
}
