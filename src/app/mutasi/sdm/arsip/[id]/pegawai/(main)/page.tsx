"use client";
import { use, useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import { usePegawai } from "@/context/mutasi/sdm";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ExpandableItemCard from "@/component/Molecules/ExpandableItemCard";
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
  const {
    setTotalPage,
    page: currentPage,
    limit,
  } = usePaginator();
  const {
    refresh,
    search,
    dataKeluarga,
    dataBiaya,
    dataTermin,
    searchTerm,
    setSearchTerm,
  } = usePegawai();
  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append("limit", limit.toString());
      if (offset) searchParams.append("offset", offset.toString());
      if (search) searchParams.append("search", search);
      if (dataKeluarga) searchParams.append("process_keluarga", dataKeluarga);
      if (dataBiaya) searchParams.append("process_biaya", dataBiaya);
      if (dataTermin) searchParams.append("process_termin", dataTermin);
      searchParams.append("associations", "Golongan,KantorAsal,KantorTujuan");
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai?${searchParams}`,
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
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPegawai();
  }, [
    refresh,
    search,
    currentPage,
    dataKeluarga,
    dataBiaya,
    dataTermin,
    limit,
  ]);

  if (error) throw error;
  return (
    <ContainerCard
      title="Daftar Pegawai Mutasi"
      headerRight={
        <div className="">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama / NIP"
            value={searchTerm}
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
            <ExpandableItemCard
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
              detail={
                <ul>
                  <li>Status Data Keluarga : {row.process_keluarga}</li>
                  <li>Status Rincian Biaya : {row.process_biaya}</li>
                  <li>Status Termin : {row.process_termin}</li>
                </ul>
              }
              status={
                <span className="badge badge-sm text-nowrap badge-info">
                  {snackToTitleCase(row.status)}
                </span>
              }
            >
              <div className="max-w-full px-4">
                <div
                  className="flex min-w-max justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tooltip" data-tip="keluarga">
                    <Link
                      href={`/mutasi/sdm/arsip/${id}/pegawai/${row.id}/keluarga`}
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
                      href={`/mutasi/sdm/arsip/${id}/pegawai/${row.id}/termin`}
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
                  <div className="tooltip" data-tip="Riwayat">
                    <div className="rounded-box bg-info/80 p-1 text-info-content">
                      <Link
                        href={`/mutasi/sdm/arsip/${id}/pegawai/${row.id}/riwayat`}
                      >
                        <Icon
                          className="hover:scale-110"
                          icon="History"
                          height={16}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableItemCard>
          ))}
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
