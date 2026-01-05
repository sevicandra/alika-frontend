"use client";
import { use } from "react";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { usePegawaiDetail, useSkDetail } from "@/context/mutasi/keu";

import Link from "next/link";
export default function Layout({
  children,
  params,
  action,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
    pegawai_id: string;
  }>;
  action: React.ReactNode;
}) {
  const { id, pegawai_id } = use(params);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: pegawai } = usePegawaiDetail();
  const { data: suratKeputusan } = useSkDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "sk") {
              return {
                name: suratKeputusan ? suratKeputusan.nomor.toLocaleUpperCase() : "Surat Keputusan",
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
                <span className="hover:cursor-not-allowed">{row.name}</span>
              )}
            </li>
          )}
        />
      </div>
      <div className="max-w-full overflow-x-auto px-4">
        <div className="flex min-w-max justify-end gap-1">
          {pegawai?.process_biaya === "IDLE" && pegawai?.process_keluarga === "DONE" && (
            <Link
              href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/keluarga/new`}
              className="btn btn-xs btn-success"
            >
              Tambah Keluarga
            </Link>
          )}
        </div>
      </div>
      {children}
      {action}
      <div className="mx-4 mb-4 flex justify-between"></div>
    </div>
  );
}
