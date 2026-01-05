"use client";
import { useEffect } from "react";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Loading from "@/component/Molecules/Loading";
import { useState } from "react";
import { DataTable } from "@/component/Organisms/DataTable";
import { useNotification } from "@/context/notifikasi";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";

export default function Page() {
  const { addNotification } = useNotification();
  const { refresh, searchs, searchsTerm, setSearchsTerm } = useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      id: string;
      kota_asal: string;
      provinsi_asal: string;
      kota_tujuan: string;
      provinsi_tujuan: string;
      rute: string;
      ekonomi: number;
      bisnis: number;
      jenis_tarif: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());
        const { search } = searchs;
        if (search) searchParams.append("search", search);

        setLoading(true);
        const res = await fetch(`/api/Mutasi/Admin/Referensi/Pesawat?${searchParams}`, {
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
          title: "Fetch Referensi Pesawat",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, refresh, searchs, addNotification, setTotalPage]);

  return (
    <ContainerCard
      title="Daftar Rute Pesawat"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) => setSearchsTerm({ search: e.target.value })}
            type="text"
            className="input-bordered input input-xs w-xs max-w-full focus:outline-none"
            placeholder="nama rute"
            value={searchsTerm.search || ""}
          />
        </div>
      }
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto">
          <DataTable
            columns={[
              "No.",
              "Rute",
              "Provinsi/Kota Asal",
              "Provinsi/Kota Tujuan",
              "Biaya",
              "Jenis",
              "",
            ]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.rute}</td>
                <td className="p-4">
                  <div>
                    <div>{row.kota_asal}</div>
                    <div>{row.provinsi_asal}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div>{row.kota_tujuan}</div>
                    <div>{row.provinsi_tujuan}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div>
                      {row.ekonomi.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </div>
                    <div>
                      {row.bisnis.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </div>
                  </div>
                </td>
                <td className="p-4">{row.jenis_tarif}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <div className="tooltip" data-tip="edit">
                      <Link href={`/mutasi/admin/referensi/pesawat/${row.id}/edit`}>
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon className="hover:scale-110" icon="SquarePen" height={16} />
                        </div>
                      </Link>
                    </div>
                    <div className="tooltip" data-tip="hapus">
                      <Link href={`/mutasi/admin/referensi/pesawat/${row.id}/hapus`}>
                        <div className="rounded-box bg-error/80 p-1 text-error-content">
                          <Icon className="hover:scale-110" icon="Trash2" height={16} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </ContainerCard>
  );
}
