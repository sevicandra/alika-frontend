"use client";
import { use } from "react";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useMutasiDetail } from "@/context/mutasi/user";
import { SanggahProvider } from "@/context/mutasi/user";

import Link from "next/link";
export default function Layout({
  children,
  params,

}: {
  children: React.ReactNode;
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { mutasi_id } = use(params);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: mutasi } = useMutasiDetail();
  if (mutasi?.CurrentSanggah) throw new Error("Sanggah sedang dalam proses");
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden">
      <div className="mx-4 mt-4  overflow-x-auto pr-4">
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
      <SanggahProvider mutasi_id={mutasi_id}>
        <div className="mx-4 overflow-auto">{children}</div>
      </SanggahProvider>
    </div>
  );
}
