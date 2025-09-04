"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
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
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Gagal Memuat Data Pembayaran Mutasi",
          message: `Gagal memuat data pembayaran mutasi: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification, id, pegawai_id]);

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
            data={data}
            columns={["No", "Nama", "Tahun Anggaran", "Nominal", "Status", ""]}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.Ref.nama}</td>
                <td className="p-4">{row.tahun}</td>
                <td className="p-4">
                  {row.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4">{row.status}</td>
                <td className="p-4">
                  <div className="tooltip" data-tip="Detail">
                    <Link
                      href={`/mutasi/sdm/arsip/${id}/pegawai/${pegawai_id}/termin/${row.id}/dokumen`}
                    >
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="Eye"
                          height={16}
                        />
                      </div>
                    </Link>
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
