"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Icon from "@/component/Atoms/LabelIcon";
import { DataTable } from "@/component/Organisms/DataTable";
import { useForm } from "@/context/form.context";
export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { setInput, input, getValidationError } = useForm();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
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
    admin_notes: string;
    submitted_at: Date | null;
    reviewed_at: Date | null;
    created_at: Date;
    DokumenTermin: {
      id: string;
      termin_id: string;
      document_type: string;
      file: string | null;
      required: boolean;
    }[];
  }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Mutasi/Keuangan/PermohonanPembayaran/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          title: "Error Fetch Data Pembayaran",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, id]);
  return (
    <ContainerCard
      title="Dokumen Pembayaran"
      className="mx-4 grid grid-rows-[auto_auto_1fr] gap-2 overflow-x-hidden"
    >
      <div className="flex flex-col items-center gap-2 px-4 pt-4">
        <DataTable
          columns={["No", "Nama", "File"]}
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
          renderRow={(row, index) => (
            <tr key={index}>
              <td className="w-10 p-4">{index + 1}</td>
              <td className="p-4">{row.document_type}</td>
              <td className="p-4">
                {row.file && (
                  <div className="tooltip" data-tip="Detail">
                    <Link href={`/mutasi/keuangan/permohonan-pembayaran/${id}/dokumen/${row.id}`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon className="hover:scale-110" icon="File" height={16} />
                      </div>
                    </Link>
                  </div>
                )}
              </td>
            </tr>
          )}
        />
      </div>
      <div className="px-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Catatan</span>
          </label>
          <textarea
            name="catatan"
            className={`textarea-bordered textarea h-24 w-full ${getValidationError("catatan") ? "textarea-error" : ""}`}
            placeholder="Catatan"
            value={input.catatan}
            onChange={(e) => setInput({ ...input, catatan: e.target.value })}
          ></textarea>
          {getValidationError("catatan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} /> {getValidationError("catatan")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
        <Link href={`/mutasi/keuangan/permohonan-pembayaran/${id}/tolak`} className="btn btn-error">
          Tolak
        </Link>
        <Link
          href={`/mutasi/keuangan/permohonan-pembayaran/${id}/setuju`}
          className={`btn btn-success`}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Approve"}
        </Link>
      </div>
    </ContainerCard>
  );
}
