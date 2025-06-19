"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import { snackToTitleCase } from "@/helpers/string.helper";
import { usePaginator } from "@/context/paginator";
import { useMutasi } from "@/context/mutasi/user";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ItemCard from "@/component/Molecules/ItemCard";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { page: currentPage, totalPage, setTotalPage, limit } = usePaginator();
  const { searchTerm, refresh, search, setSearchTerm } = useMutasi();

  const [data, setData] = useState<
    {
      id: string;
      nip: string;
      nama: string;
      golongan: string;
      kantor_asal: string;
      kantor_tujuan: string;
      process_keluarga: string;
      process_biaya: string;
      process_termin: string;
      status: string;
      Golongan: {
        kode: string;
        nama: string;
      };
      KantorAsal: {
        kode_satker: string;
        kantor: string;
      };
      KantorTujuan: {
        kode_satker: string;
        kantor: string;
      };
      SuratKeputusan: {
        nomor: string;
        tanggal: string;
        uraian: string;
      };
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (limit) searchParams.append("offset", (currentPage - 1).toString());
        if (search) searchParams.append("search", search);
        const res = await fetch(`/api/Mutasi/Pegawai/Mutasi?${searchParams}`, {
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
        console.log(error);
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, [refresh, search, currentPage, limit]);

  return (
    <ContainerCard
      title="Daftar SK Mutasi"
      headerRight={
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="input-bordered input input-xs w-3xs max-w-full focus:outline-none"
          placeholder="Cari berdasarkan Nomor/Perihal"
          value={searchTerm}
        />
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/20 p-4">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          {data.map((item, index) => (
            <ItemCard
              key={index}
              title={item.SuratKeputusan.nomor}
              subtitle={
                <div className="flex flex-col">
                  <span>{item.SuratKeputusan.uraian}</span>
                  <span>
                    {new Date(item.SuratKeputusan.tanggal).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                  <span className="text-wrap">
                    {item.KantorAsal.kantor} → {item.KantorTujuan.kantor}
                  </span>
                </div>
              }
              status={
                <span className="badge badge-sm text-nowrap badge-info">
                  {snackToTitleCase(item.status)}
                </span>
              }
            >
              <div className="max-w-full overflow-x-auto px-4">
                <div
                  className="flex min-w-max justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/mutasi/user/mutasi/${item.id}/timeline`}
                    className="btn btn-xs btn-primary"
                  >
                    Timeline
                  </Link>
                  <Link
                    href={`/mutasi/user/mutasi/${item.id}/data-pokok`}
                    className="btn btn-xs btn-primary"
                  >
                    Data Pokok
                  </Link>
                  {item.status === "APPROVED" && (
                    <Link href={`/mutasi/user/mutasi/${item.id}/pembayaran`} className="btn btn-xs btn-primary">
                      Pembayaran
                    </Link>
                  )}
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
