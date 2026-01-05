"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { usePaginator } from "@/context/paginator";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { page: currentPage, setTotalPage, limit } = usePaginator();
  const [data, setData] = useState<
    {
      id: string;
      dokumen_id: string;
      role: "PEGAWAI" | "PEJABAT_KANTOR_ASAL" | "PEJABAT_KANTOR_TUJUAN" | "BENDAHARA" | "PPK";
      nama: string;
      nip: string;
      jenis: string;
    }[]
  >([]);
  const { refresh } = useTable();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (limit) searchParams.append("offset", (currentPage - 1).toString());
        const res = await fetch(`/api/Mutasi/Pegawai/TTE?${searchParams}`, {
          method: "GET",
        });

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }

        const { data, meta } = await res.json();
        setData(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          title: `Permohonan TTE`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, currentPage, limit, addNotification, setTotalPage]);

  return (
    <ContainerCard
      title="Permohonan TTE"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/20 p-4">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          <DataTable
            data={data}
            columns={["No", "Nama/NIP", "Jenis", ""]}
            renderRow={(row, index) => {
              return (
                <tr key={index}>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    {row.nama} / {row.nip}
                  </td>
                  <td className="p-4">
                    {row.jenis === "SPD2"
                      ? row.role === "PEJABAT_KANTOR_ASAL"
                        ? "SPD Keberangkatan"
                        : row.role === "PEJABAT_KANTOR_TUJUAN"
                          ? "SPD Ketujuan"
                          : ""
                      : row.jenis}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <div className="tooltip" data-tip="Detail">
                        <Link href={`/mutasi/user/tte/${row.id}/file`}>
                          <div className="rounded-box bg-info/80 p-1 text-info-content">
                            <Icon className="hover:scale-110" icon="Eye" height={16} />
                          </div>
                        </Link>
                      </div>
                      <div className="tooltip" data-tip="Kirim">
                        <Link href={`/mutasi/user/tte/${row.id}/process`}>
                          <div className="rounded-box bg-info/80 p-1 text-info-content">
                            <Icon className="hover:scale-110" icon="Send" height={16} />
                          </div>
                        </Link>
                      </div>
                      <div className="tooltip" data-tip="Tolak">
                        <Link href={`/mutasi/user/tte/${row.id}/tolak`}>
                          <div className="rounded-box bg-error/80 p-1 text-error-content">
                            <Icon className="hover:scale-110" icon="CircleX" height={16} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
