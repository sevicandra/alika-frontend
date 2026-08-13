"use client";
import { use, useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ItemCard from "@/component/Molecules/ItemCard";
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
    }[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { setTotalPage, page: currentPage, limit } = usePaginator();
  const { refresh, searchs, filter, searchsTerm, setSearchsTerm } = useTable();

  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append("limit", limit.toString());
      if (offset) searchParams.append("offset", offset.toString());
      const { search } = searchs;
      if (search) searchParams.append("search", search);
      searchParams.append("associations", "Golongan,KantorAsal,KantorTujuan");
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/AddendumPembayaran/${id}/Pegawai?${searchParams}`,
          {
            method: "GET",
          },
        );

        const { error, data, meta } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(data);
        setTotalPage(meta.totalPages);
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
  }, [
    refresh,
    searchs,
    currentPage,
    filter,
    limit,
    addNotification,
    id,
    setTotalPage,
  ]);

  if (error) throw error;
  return (
    <ContainerCard
      title="Daftar Pegawai Mutasi"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) =>
              setSearchsTerm({ ...searchsTerm, search: e.target.value })
            }
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama / NIP"
            value={searchsTerm.search || ""}
          />
        </div>
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
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
                    Pangkat/Gol. : {row.Golongan.nama} / {row.Golongan.kode}
                  </li>
                  <li>Kantor Asal : {row.KantorAsal.kantor}</li>
                  <li>Kantor Tujuan : {row.KantorTujuan.kantor}</li>
                </ul>
              }
            >
              <div className="max-w-full px-4">
                <div
                  className="flex min-w-max justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tooltip" data-tip="biaya">
                    <Link
                      href={`/mutasi/sdm/addendum-pembayaran/${id}/pegawai/${row.id}/biaya`}
                    >
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="CreditCard"
                          height={16}
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="tooltip" data-tip="process">
                    <Link
                      href={`/mutasi/sdm/addendum-pembayaran/${id}/pegawai/${row.id}/process`}
                    >
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="Send"
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
