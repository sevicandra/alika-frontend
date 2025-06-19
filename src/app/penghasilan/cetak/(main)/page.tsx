"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useEffect, useState, useContext, use } from "react";
import { useRouter } from "next/navigation";
import { PaginatorContext } from "@/context/paginator";
import { NotificationContext } from "@/context/notifikasi";
import { CetakContext } from "@/context/penghasilan/cetak";
import Link from "next/link";
import Confirmation from "@/component/Molecules/Confirmation";
import Loading from "@/component/Molecules/Loading";
import Paginator from "@/component/Organisms/Paginator";
import { useSession } from "@/context/session";
import ContainerCard from "@/component/Molecules/ContainerCard";
export default function CetakMain() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthenticated");
      window.location.href = "/api/auth/signin";
    }
  }, [status]);

  const router = useRouter();
  const { setRefresh, refresh } = useContext(CetakContext);

  const {
    page: currentPage,
    limit,
    setPage,
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
      penandatangan: string;
      status: number;
      id: string;
    }[]
  >([]);
  const [isDelete, setIsDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const offset = (Number(currentPage) - 1) * limit;
        const res = await fetch(
          `/api/Penghasilan/DataCetak?limit=${limit}&offset=${offset}`,
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
              penandatangan: item.nama_tujuan,
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
          title: "Data Cetak",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, refresh]);

  const HapusData = async () => {
    try {
      const res = await fetch(`/api/Penghasilan/DataCetak/${isDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        message: "Data Cetak berhasil dihapus",
        title: "Data Cetak",
      });
    } catch (error: any) {
      addNotification({
        message: (error as Error).message,
        title: "Data Cetak",
      });
    } finally {
      setIsDelete(null);
      setRefresh();
      router.refresh();
    }
  };
  if (error) throw error;
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
                    <button
                      onClick={() => setIsDelete(row.id)}
                      className="btn join-item btn-xs btn-error"
                    >
                      hapus
                    </button>
                  )}
                  <Link
                    href={`/penghasilan/cetak/preview/${row.id}`}
                    className="btn join-item btn-xs btn-info"
                  >
                    view
                  </Link>
                </div>
              </td>
            </tr>
          )}
        />
        <Confirmation
          onConfirm={HapusData}
          isOpen={!isDelete ? false : true}
          onCancel={() => setIsDelete(null)}
        />
      </div>
    </ContainerCard>
  );
}
