"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
import { useTable } from "@/context/table.context";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
  }>;
}) {
  const { mutasi_id, pembayaran_id } = use(params);
  const { refresh } = useTable();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const [data, setData] = useState<{
    id: string;
    ref_termin: string;
    pegawai_id: string;
    tahun: string;
    nominal: number;
    status:
      | "DRAFT"
      | "PENDING"
      | "WAITING_APPROVAL"
      | "WAITING_APPROVAL_SDM"
      | "APPROVED_SDM"
      | "WAITING_APPROVAL_KEU"
      | "APPROVED_KEU"
      | "PAID"
      | "REJECTED";
    DokumenTermin: {
      id: string;
      termin_id: string;
      document_type: string;
      file: string;
      required: boolean;
      uploadable: boolean;
      process: "IDLE" | "PROCESSING";
      processed_by: string;
    }[];
  }>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}`,
        );
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }

        setData(data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Fetch Data Pembayaran Mutasi",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, addNotification, mutasi_id, pembayaran_id]);

  if (error) throw error;
  return (
    <ContainerCard
      title="Pembayaran Mutasi"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {loading && (
            <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
              <Loading />
            </div>
          )}
          <DataTable
            data={
              data?.DokumenTermin.sort((a, b) => {
                const setPriority = (type: boolean) => {
                  if (type) return 0;
                  return 1;
                };
                return (
                  setPriority(a.required) - setPriority(b.required) ||
                  a.document_type.localeCompare(b.document_type)
                );
              }) || []
            }
            columns={["Dokumen", ""]}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{`${row.document_type} (${row.required ? "Wajib" : "Opsional"})`}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {row.file && (
                      <div className="tooltip" data-tip="Detail">
                        <Link
                          href={`/mutasi/user/mutasi/${mutasi_id}/pembayaran/${pembayaran_id}/dokumen/${row.id}/file`}
                        >
                          <div className="rounded-box bg-info/80 p-1 text-info-content">
                            <Icon
                              className="hover:scale-110"
                              icon="File"
                              height={16}
                            />
                          </div>
                        </Link>
                      </div>
                    )}
                    {row.uploadable &&
                      (data?.status === "DRAFT" ||
                        data?.status === "REJECTED") && (
                        <div className="tooltip" data-tip="Upload">
                          <Link
                            href={`/mutasi/user/mutasi/${mutasi_id}/pembayaran/${pembayaran_id}/dokumen/${row.id}/upload`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon
                                className="hover:scale-110"
                                icon="Upload"
                                height={16}
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                    {row.uploadable &&
                      row.file &&
                      (data?.status === "DRAFT" ||
                        data?.status === "REJECTED") && (
                        <div className="tooltip" data-tip="Hapus">
                          <Link
                            href={`/mutasi/user/mutasi/${mutasi_id}/pembayaran/${pembayaran_id}/dokumen/${row.id}/hapus`}
                          >
                            <div className="rounded-box bg-error/80 p-1 text-error-content">
                              <Icon
                                className="hover:scale-110"
                                icon="Trash2"
                                height={16}
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                    {(data?.status === "DRAFT" ||
                      data?.status === "REJECTED") &&
                      row.document_type === "SPD2" && (
                        <div className="tooltip" data-tip="Penandatangan">
                          <Link
                            href={`/mutasi/user/mutasi/${mutasi_id}/pembayaran/${pembayaran_id}/dokumen/${row.id}/penandatangan`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon
                                className="hover:scale-110"
                                icon="FilePen"
                                height={16}
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
