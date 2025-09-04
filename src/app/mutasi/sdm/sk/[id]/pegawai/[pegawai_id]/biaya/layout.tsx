"use client";
import { use } from "react";
import { TableProvider } from "@/context/table.context";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useSkDetail, usePegawaiDetail } from "@/context/mutasi/sdm";
export default function Layout({
  children,
  action,
  params,
}: {
  children: React.ReactNode;
  action: React.ReactNode;
  params: Promise<{
    id: string;
    pegawai_id: string;
  }>;
}) {
  const { id, pegawai_id } = use(params);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: pegawai } = usePegawaiDetail();
  const { data: suratKeputusan } = useSkDetail();

  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4  overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "sk") {
              return {
                name: suratKeputusan
                  ? suratKeputusan.nomor.toLocaleUpperCase()
                  : "Surat Keputusan",
              };
            }
            if (pathSegments[index - 1] === "pegawai") {
              return {
                name: pegawai ? pegawai.nama.toLocaleUpperCase() : "Pegawai",
              };
            }
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/mutasi/sdm/${pathSegments.slice(0, index + 1).join("/")}`,
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
        <div className="flex min-w-max justify-end gap-1">
          {pegawai?.process_termin === "IDLE" &&
            pegawai?.process_biaya === "DONE" && (
              <>
                <Link
                  href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/biaya/reset`}
                  className="btn btn-xs btn-success"
                >
                  Reset
                </Link>
                <Link
                  href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/biaya/new`}
                  className="btn btn-xs btn-success"
                >
                  Tambah Biaya
                </Link>
              </>
            )}
        </div>
      </div>
      <TableProvider>
        {children}
        {action}
      </TableProvider>
      <div className="mx-4 mb-4 flex justify-between"></div>
    </div>
  );
}
