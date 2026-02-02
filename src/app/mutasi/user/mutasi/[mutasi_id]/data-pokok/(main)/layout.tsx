"use client";
import { use } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { useMutasiDetail } from "@/context/mutasi/user";

export default function Layout({
  action,
  keluarga,
  biaya,
  params,
}: {
  action: React.ReactNode;
  keluarga: React.ReactNode;
  biaya: React.ReactNode;
  params: Promise<{ mutasi_id: string }>;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: mutasi } = useMutasiDetail();
  const { mutasi_id } = use(params);
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
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
      <div className="grid max-h-full grid-rows-[auto_1fr] gap-4 overflow-hidden">
        <div className="flex justify-end gap-2 px-4">
          {mutasi?.status === "PENDING_APROVAL" && !mutasi?.CurrentSanggah && (
            <>
              <Link
                href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/sanggah`}
                className="btn btn-xs btn-warning"
              >
                Sanggah
              </Link>
              <Link
                href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/approve`}
                className="btn btn-xs btn-success"
              >
                Approve
              </Link>
            </>
          )}
        </div>
        <div className="overflow-y-auto py-4">
          {keluarga}
          {mutasi?.status !== "DRAFT" &&
            mutasi?.status !== "PENDING_APROVAL" &&
            mutasi?.status !== "CALCULATING" &&
            mutasi?.status !== "DISPUTED" &&
            mutasi?.status !== "REVISED" &&
            biaya}
        </div>
      </div>
      <>{action}</>
    </div>
  );
}
