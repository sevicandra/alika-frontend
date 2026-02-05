"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import Link from "next/link";
import Loading from "@/component/Molecules/Loading";
import { useSession } from "@/context/session";
import ContainerCard from "@/component/Molecules/ContainerCard";
export default function Page() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthenticated");
      window.location.href = "/api/auth/signin";
    }
  }, [status]);
  const { refresh } = useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const { addNotification } = useNotification();
  const [data, setData] = useState<
    {
      jenis: string;
      nomor: string;
      tanggal: number;
      hal: string;
      penandatangan: string;
      status: number;
      id: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const offset = (Number(currentPage) - 1) * limit;
        const res = await fetch(
          `/api/Penghasilan/DataCetak?limit=${limit}&offset=${offset}&sort=-tanggal`,
          {
            method: "GET",
          },
        );
        const { data, error, meta } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(
          data.map((item: any) => {
            return {
              jenis: item.jenis,
              nomor: item.nomor,
              tanggal: item.tanggal,
              hal: item.perihal,
              penandatangan: item.nama_tujuan,
              status: item.status,
              id: item.id,
            };
          }),
        );
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Data Cetak",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, refresh, limit, addNotification, setTotalPage]);

  return (
    <ContainerCard className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden">
      <div className="overflow-auto">
        {isLoading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <DataTable
          columns={[
            "No",
            "Jenis",
            "Nomor",
            "Tanggal",
            "Hal",
            "Penandatangan",
            "Status",
            "Aksi",
          ]}
          data={data}
          renderRow={(row, index) => (
            <tr key={row.id}>
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{row.jenis}</td>
              <td className="p-4">{row.nomor}</td>
              <td className="p-4">
                {new Date(row.tanggal * 1000).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </td>
              <td className="p-4">{row.hal}</td>
              <td className="p-4">{row.penandatangan}</td>
              <td className="p-4">
                {row.status === 0
                  ? "Menunggu TTE"
                  : row.status === 1
                    ? "Sudah di TTE"
                    : "Ditolak"}
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-1">
                  {row.status === 2 && (
                    <Link
                      href={`/penghasilan/cetak/${row.id}/hapus`}
                      className="btn join-item btn-xs btn-error"
                    >
                      hapus
                    </Link>
                  )}
                  <Link
                    href={`/penghasilan/cetak/${row.id}/preview`}
                    className="btn join-item btn-xs btn-info"
                  >
                    view
                  </Link>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </ContainerCard>
  );
}
