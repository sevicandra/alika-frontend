"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePegawaiDetail, useSkDetail } from "@/context/mutasi/bendahara";

export default function Layout({
  children,
  action,
}: {
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: pegawai } = usePegawaiDetail();
  const { data: suratKeputusan } = useSkDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
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
              href: `/mutasi/Bendahara/${pathSegments.slice(0, index + 1).join("/")}`,
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
      {children}
      {action}
      <div className="mx-4 mb-4 flex justify-between"></div>
    </div>
  );
}
