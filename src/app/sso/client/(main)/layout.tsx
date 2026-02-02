"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";

export default function Layout({
  children,
  action,
}: {
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(1);
  const { totalPage } = usePaginator();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/sso/${pathSegments.slice(0, index + 1).join("/")}`,
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
          <Link href="/sso/client/new" className="btn btn-xs btn-success">
            Tambah
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
