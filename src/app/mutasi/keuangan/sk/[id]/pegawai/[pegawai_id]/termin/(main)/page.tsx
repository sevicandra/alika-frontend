"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
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
      tahun: string;
      nominal: number;
      status: string;
      nama: string;
      urutan: number;
    }[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/Keuangan/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`,
          {
            method: "GET",
          }
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
  }, [addNotification, id, pegawai_id]);
  if (error) throw error;
  return (
    <ContainerCard title="Termin" className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden">
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {loading && (
            <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
              <Loading />
            </div>
          )}
          <DataTable
            columns={["No", "Nama", "Nominal", "Status", ""]}
            data={data.sort((a, b) => a.urutan - b.urutan)}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{snackToTitleCase(row.nama)}</td>
                <td className="px-4 py-2">
                  {row.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="px-4 py-2">{snackToTitleCase(row.status)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <div className="tooltip" data-tip="detail">
                      <Link
                        href={`/mutasi/keuangan/sk/${id}/pegawai/${pegawai_id}/termin/${row.id}/dokumen`}
                      >
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon className="hover:scale-110" icon="Eye" height={16} />
                        </div>
                      </Link>
                    </div>
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
