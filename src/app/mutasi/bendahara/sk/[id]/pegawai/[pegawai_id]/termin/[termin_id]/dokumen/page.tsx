"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Icon from "@/component/Atoms/LabelIcon";
import { DataTable } from "@/component/Organisms/DataTable";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
    pegawai_id: string;
    termin_id: string;
  }>;
}) {
  const { addNotification } = useNotification();
  const { id, pegawai_id, termin_id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      termin_id: string;
      document_type: string;
      file: string | null;
      required: boolean;
    }[]
  >();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/Mutasi/Bendahara/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin/${termin_id}/Dokumen`,
          {
            method: "GET",
          },
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
        addNotification({
          title: "Error Fetch Data Pembayaran",
          message: (error as Error).message,
          variant: "error",
        });
      }
    };
    fetchData();
  }, [addNotification, id, pegawai_id, termin_id]);
  return (
    <ContainerCard
      title="Dokumen Pembayaran"
      className="mx-4 grid grid-rows-[auto_auto_1fr] gap-2 overflow-x-hidden"
    >
      <div className="flex flex-col items-center gap-2 px-4 pt-4">
        <DataTable
          columns={["No", "Nama", "File"]}
          data={
            data?.sort((a, b) => {
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
                    <Link
                      href={`/mutasi/bendahara/sk/${id}/pegawai/${pegawai_id}/termin/${termin_id}/dokumen/${row.id}/file`}
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
              </td>
            </tr>
          )}
        />
      </div>
    </ContainerCard>
  );
}
