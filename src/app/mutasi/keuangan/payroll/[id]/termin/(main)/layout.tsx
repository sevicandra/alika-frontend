"use client";
import React, { use } from "react";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { PayrollProvider } from "@/context/mutasi/keu";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";
import { useSkDetail } from "@/context/mutasi/keu";

export default function Layout({
  children,
  params,
  action,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
  action: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { totalPage } = usePaginator();
  const { id } = use(params);
  const { data: suratKeputusan } = useSkDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "payroll") {
              return {
                name: suratKeputusan
                  ? suratKeputusan.nomor.toUpperCase()
                  : "Surat Keputusan",
              };
            }
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/mutasi/keuangan/${pathSegments.slice(0, index + 1).join("/")}`,
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
          <Link
            href={`/mutasi/keuangan/payroll/${id}/termin/download`}
            className="btn btn-xs btn-success"
          >
            Download
          </Link>
        </div>
      </div>
<PayrollProvider>
  <>{children}</>
  <>{action}</>
</PayrollProvider>

      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
    </div>
  );
}
