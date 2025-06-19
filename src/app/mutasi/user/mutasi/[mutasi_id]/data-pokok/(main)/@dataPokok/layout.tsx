"use client";
import { use } from "react";
import Link from "next/link";
import { useMutasiDetail } from "@/context/mutasi/user";
export default function Layout({
  keluarga,
  biaya,
  params,
}: {
  keluarga: any;
  biaya: React.ReactNode;
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = use(params);
  const { data: mutasi } = useMutasiDetail();
  return (
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
          mutasi?.status !== "REVISED" && biaya}
      </div>
    </div>
  );
}
