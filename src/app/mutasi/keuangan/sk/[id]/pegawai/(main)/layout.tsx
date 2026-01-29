"use client";
import { use } from "react";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useSkDetail } from "@/context/mutasi/keu";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { useTable } from "@/context/table.context";

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
  const { id } = use(params);
  const pathname = usePathname();
  const { totalPage } = usePaginator();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);

  const { data: suratKeputusan } = useSkDetail();
  const { searchsTerm, setSearchsTerm } = useTable();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "sk") {
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
                <span className="hover:cursor-not-allowed">{row.name}</span>
              )}
            </li>
          )}
        />
      </div>
      <div className="max-w-full overflow-x-auto px-4">
        <div className="flex min-w-max justify-end gap-1">
          <Link
            href={`/mutasi/keuangan/sk/${id}/pegawai/overview`}
            className="btn btn-xs btn-success"
          >
            Overview
          </Link>
        </div>
      </div>
      <ContainerCard
        title="Daftar Pegawai Mutasi"
        headerRight={
          <div className="">
            <input
              onChange={(e) => setSearchsTerm({...searchsTerm, search: e.target.value})}
              type="text"
              className="input-bordered input input-xs w-md max-w-full focus:outline-none"
              placeholder="Cari berdasarkan Nama / NIP"
              value={searchsTerm.search}
            />
          </div>
        }
        className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
      >
        {children}
      </ContainerCard>
      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
      {action}
    </div>
  );
}
