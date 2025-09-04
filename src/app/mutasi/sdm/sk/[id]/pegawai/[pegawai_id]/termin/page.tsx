"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import { usePegawaiDetail, useSkDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
    pegawai_id: string;
  }>;
}) {
  const { id, pegawai_id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      urutan: number;
      nominal: number;
      Ref: {
        nama: string;
        required_doc: {
          jenis: string;
          optional: boolean;
          penandatatangan: string[];
        }[];
        urutan: number;
      };
    }[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { data: pegawai } = usePegawaiDetail();
  const { data: suratKeputusan } = useSkDetail();
  const { refresh } = useTable();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          title: `Data Termin`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, addNotification, pegawai_id, id]);
  if (error) throw error;
  return (
    <ContainerCard
      title="Termin"
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
            columns={["No", "Nama", "Required Doc", "Nominal", ""]}
            data={data.sort((a, b) => a.Ref.urutan - b.Ref.urutan)}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{snackToTitleCase(row.Ref.nama)}</td>
                <td className="px-4 py-2">
                  {row.Ref.required_doc.map((doc, idx) => (
                    <div key={idx} className="mb-1">
                      <span className="font-semibold">
                        {snackToTitleCase(doc.jenis)}:
                      </span>{" "}
                      {doc.optional ? "Opsional" : "Wajib"} - Penandatangan:{" "}
                      {doc.penandatatangan
                        .map((penandatangan) => snackToTitleCase(penandatangan))
                        .join(", ")}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  {row.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="px-4 py-2">
                  {pegawai?.process_termin === "DONE" &&
                    suratKeputusan?.status === "DRAFT" && (
                      <div className="flex gap-1">
                        <div className="tooltip" data-tip="edit">
                          <Link
                            href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/termin/${row.id}/edit`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon
                                className="hover:scale-110"
                                icon="SquarePen"
                                height={16}
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="tooltip" data-tip="hapus">
                          <Link
                            href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/termin/${row.id}/hapus`}
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
                      </div>
                    )}
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
