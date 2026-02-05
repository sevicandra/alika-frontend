"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import Link from "next/link";
import { useTable } from "@/context/table.context";
import Loading from "@/component/Molecules/Loading";
import Paginator from "@/component/Organisms/Paginator";
export default function Page() {
  const { page: currentPage, limit, totalPage, setTotalPage } = usePaginator();
  const { addNotification } = useNotification();
  const [data, setData] = useState<
    {
      jenis: string;
      nomor: string;
      tanggal: number;
      hal: string;
      pemohon: string;
      status: number;
      id: string;
    }[]
  >([]);
  const { refresh } = useTable();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const offset = (Number(currentPage) - 1) * limit;
        const res = await fetch(
          `/api/Penghasilan/DataTTE?limit=${limit}&offset=${offset}&status=1&sort=-tanggal`,
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
              pemohon: item.tujuan,
              status: item.status,
              id: item.id,
            };
          }),
        );
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Data TTE",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, refresh, limit, addNotification, setTotalPage]);

  return (
    <div className="relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
      <div></div>
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
            "Pemohon/Tujuan",
            "Aksi",
          ]}
          data={data}
          renderRow={(row, index) => (
            <tr key={index}>
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{row.jenis}</td>
              <td className="p-4">{row.nomor}</td>
              <td className="p-4">
                {" "}
                {new Date(row.tanggal * 1000).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </td>
              <td className="p-4">{row.hal}</td>
              <td className="p-4">{row.pemohon}</td>
              <td className="p-4">
                <Link
                  href={`/penghasilan/tte/preview/${row.id}`}
                  className="btn join-item btn-xs btn-info"
                >
                  view
                </Link>
              </td>
            </tr>
          )}
        />
      </div>
      <div>{totalPage && <Paginator />}</div>
    </div>
  );
}
