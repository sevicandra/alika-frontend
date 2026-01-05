"use client";
import { use, useEffect, useState } from "react";
import { usePaginator } from "@/context/paginator";
import { useNotification } from "@/context/notifikasi";
import { useSkDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
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
  const { setTotalPage, page: currentPage, limit } = usePaginator();
  const { refresh, searchs, filter, searchsTerm, setSearchsTerm, setFilter } = useTable();
  const { data: SuratKeputusan } = useSkDetail();

  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append("limit", limit.toString());
      if (offset) searchParams.append("offset", offset.toString());
      const { search } = searchs;
      const { dataKeluarga, dataBiaya, dataTermin } = filter;
      if (search) searchParams.append("search", search);
      if (dataKeluarga) searchParams.append("process_keluarga", dataKeluarga);
      if (dataBiaya) searchParams.append("process_biaya", dataBiaya);
      if (dataTermin) searchParams.append("process_termin", dataTermin);
      searchParams.append("associations", "Golongan,KantorAsal,KantorTujuan");
      try {
        const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai?${searchParams}`, {
          method: "GET",
        });
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
  }, [refresh, searchs, currentPage, filter, limit, addNotification, id, setTotalPage]);

  if (error) throw error;
  return (
    <ContainerCard
      title="Daftar Pegawai Mutasi"
      headerRight={
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <input
            onChange={(e) => setSearchsTerm({ ...searchsTerm, search: e.target.value })}
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama / NIP"
            value={searchsTerm.search || ""}
          />
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setFilter({ ...filter, dataKeluarga: e.target.value })}
            value={filter.dataKeluarga || ""}
          >
            <option value="">Semua Status Data Keluarga</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setFilter({ ...filter, dataBiaya: e.target.value })}
            value={filter.dataBiaya || ""}
          >
            <option value="">Semua Status Rincian Biaya</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setFilter({ ...filter, dataTermin: e.target.value })}
            value={filter.dataTermin || ""}
          >
            <option value="">Semua Status Termin</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
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
                  {row.process_keluarga === "IDLE" && (
                    <div className="tooltip" data-tip="edit">
                      <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/edit`}>
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon className="hover:scale-110" icon="SquarePen" height={16} />
                        </div>
                      </Link>
                    </div>
                  )}
                  <div className="tooltip" data-tip="keluarga">
                    <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/keluarga`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon className="hover:scale-110" icon="Users" height={16} />
                      </div>
                    </Link>
                  </div>
                  <div className="tooltip" data-tip="biaya">
                    <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/biaya`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon className="hover:scale-110" icon="CreditCard" height={16} />
                      </div>
                    </Link>
                  </div>
                  <div className="tooltip" data-tip="termin">
                    <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/termin`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon className="hover:scale-110" icon="Receipt" height={16} />
                      </div>
                    </Link>
                  </div>
                  {SuratKeputusan?.status === "DRAFT" && (
                    <>
                      <div className="tooltip" data-tip="reset">
                        <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/reset-data`}>
                          <div className="rounded-box bg-warning/80 p-1 text-warning-content">
                            <Icon className="hover:scale-110" icon="Reset" height={16} />
                          </div>
                        </Link>
                      </div>
                      <div className="tooltip" data-tip="hapus">
                        <Link href={`/mutasi/sdm/sk/${id}/pegawai/${row.id}/hapus`}>
                          <div className="rounded-box bg-error/80 p-1 text-error-content">
                            <Icon className="hover:scale-110" icon="Trash2" height={16} />
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
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
