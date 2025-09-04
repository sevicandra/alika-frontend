"use client";
import { use, useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import { useSkDetail } from "@/context/mutasi/keu";
import { useTable } from "@/context/table.context";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import ItemCard from "@/component/Molecules/ItemCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      nip: string;
      nama: string;
      kode_golongan: string;
      nama_golongan: string;
      kantor_asal: string;
      kantor_tujuan: string;
      status: string;
      gologan: string;
      total_tagihan: number;
    }[]
  >([]);
  const { loading, error, setError, setLoading } = useSkDetail();
  const { addNotification } = useNotification();
  const { setTotalPage, page: currentPage, limit } = usePaginator();
  const { refresh, searchs } = useTable();
  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append("limit", limit.toString());
      if (offset) searchParams.append("offset", offset.toString());
      const {search} = searchs;
      if (search) searchParams.append("search", search);
      try {
        const res = await fetch(
          `/api/Mutasi/Keuangan/SuratKeputusan/${id}/Pegawai?${searchParams}`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        setData(data.data);
        setTotalPage(data.meta.totalPages);
      } catch (error) {
        addNotification({
          title: `Data Pegawai`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPegawai();
  }, [refresh, searchs, currentPage, limit, addNotification, id, setError, setLoading, setTotalPage]);
  if (error) throw error;
  return (
    <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
      <div className="overflow-y-auto py-2">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        {data.map((row) => (
          <ItemCard
            key={row.id}
            title={`${row.nama} / ${row.nip}`}
            subtitle={
              <ul>
                <li>
                  Pangkat/Gol. : {row.nama_golongan} / {row.kode_golongan}
                </li>
                <li>Kantor Asal : {row.kantor_asal}</li>
                <li>Kantor Tujuan : {row.kantor_tujuan}</li>
                <li>
                  Total Tagihan :{" "}
                  {row.total_tagihan.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </li>
              </ul>
            }
            status={
              <span className="badge badge-sm text-nowrap badge-info">
                {snackToTitleCase(row.status)}
              </span>
            }
          >
            <div className="max-w-full overflow-x-auto px-4">
              <div
                className="flex min-w-max justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="tooltip" data-tip="keluarga">
                  <Link
                    href={`/mutasi/keuangan/sk/${id}/pegawai/${row.id}/keluarga`}
                  >
                    <div className="rounded-box bg-info/80 p-1 text-info-content">
                      <Icon
                        className="hover:scale-110"
                        icon="Users"
                        height={16}
                      />
                    </div>
                  </Link>
                </div>
                <div className="tooltip" data-tip="termin">
                  <Link
                    href={`/mutasi/keuangan/sk/${id}/pegawai/${row.id}/termin`}
                  >
                    <div className="rounded-box bg-info/80 p-1 text-info-content">
                      <Icon
                        className="hover:scale-110"
                        icon="Receipt"
                        height={16}
                      />
                    </div>
                  </Link>
                </div>
                <div className="tooltip" data-tip="history">
                  <Link
                    href={`/mutasi/keuangan/sk/${id}/pegawai/${row.id}/riwayat`}
                  >
                    <div className="rounded-box bg-info/80 p-1 text-info-content">
                      <Icon
                        className="hover:scale-110"
                        icon="History"
                        height={16}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      <div className="overflow-hidden"></div>
    </div>
  );
}
