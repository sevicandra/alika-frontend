"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useEffect, useState, use, Suspense, useContext } from "react";
import { PaginatorContext } from "@/lib/context/paginator";
import { NotificationContext } from "@/lib/context/notifikasi";
import Link from "next/link";
import { TteContext } from "@/lib/context/penghasilan/tte";
import Loading from "@/component/Molecules/Loading";
import Paginator from "@/component/Organisms/Paginator";
export default function Page() {
  const {
    setPage,
    page: currentPage,
    limit,
    totalPage,
    setTotalPage,
  } = useContext(PaginatorContext);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
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
  const { refresh } = useContext(TteContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const offset = (Number(currentPage) - 1) * limit;
        const res = await fetch(
          `/api/Penghasilan/DataTTE?limit=${limit}&offset=${offset}&status=1&sortField=tanggal&sortOrder=desc`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        setData(
          data.data.map((item: any) => {
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
        setTotalPage(data.meta.totalPages);
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: "Data TTE",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, refresh]);
  if (error) throw error;
  return (
    <div className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-2">
      <div></div>
      <div className="overflow-auto">
        {isLoading && (
          <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
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
              <td className="p-4">{row.tanggal}</td>
              <td className="p-4">{row.hal}</td>
              <td className="p-4">{row.pemohon}</td>
              <td className="p-4">
                <Link
                  href={`/penghasilan/tte/preview/${row.id}`}
                  className="btn btn-xs btn-info join-item"
                >
                  view
                </Link>
              </td>
            </tr>
          )}
        />
      </div>
      <div>
        {totalPage > 1 && (
          <Paginator
            action={setPage}
            totalPage={totalPage}
            page={currentPage}
          />
        )}
      </div>
    </div>
  );
}
