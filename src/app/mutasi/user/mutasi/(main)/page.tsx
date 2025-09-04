"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import { snackToTitleCase } from "@/helpers/string.helper";
import { usePaginator } from "@/context/paginator";
import { useTable } from "@/context/table.context";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ItemCard from "@/component/Molecules/ItemCard";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { page: currentPage, setTotalPage, limit } = usePaginator();
  const { searchsTerm, refresh, searchs, setSearchsTerm } = useTable();

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
        const { search } = searchs;
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
          variant: "error",
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, [refresh, searchs, currentPage, limit, addNotification, setTotalPage]);

  return (
    <ContainerCard
      title="Daftar SK Mutasi"
      headerRight={
        <input
          onChange={(e) => setSearchsTerm({ search: e.target.value })}
          type="text"
          className="input-bordered input input-xs w-3xs max-w-full focus:outline-none"
          placeholder="Cari berdasarkan Nomor/Perihal"
          value={searchsTerm.search}
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
              <div className="max-w-full px-4">
                <div
                  className="flex min-w-max flex-nowrap justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tooltip" data-tip="timeline">
                    <Link href={`/mutasi/user/mutasi/${item.id}/timeline`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="CalendarDays"
                          height={16}
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="tooltip" data-tip="data pokok">
                    <Link href={`/mutasi/user/mutasi/${item.id}/data-pokok`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="Users"
                          height={16}
                        />
                      </div>
                    </Link>
                  </div>
                  {item.status === "APPROVED" && (
                    <div className="tooltip" data-tip="pembayaran">
                      <Link href={`/mutasi/user/mutasi/${item.id}/pembayaran`}>
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon
                            className="hover:scale-110"
                            icon="CreditCard"
                            height={16}
                          />
                        </div>
                      </Link>
                    </div>
                  )}
                  <div className="tooltip" data-tip="riwayat">
                    <Link href={`/mutasi/user/mutasi/${item.id}/riwayat`}>
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
    </ContainerCard>
  );
}
