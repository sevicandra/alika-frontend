"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ExpandableItemCard from "@/component/Molecules/ExpandableItemCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import Icon from "@/component/Atoms/LabelIcon";
export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { refresh, setFilter, searchsTerm, setSearchsTerm, filter, searchs } = useTable();

  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [data, setData] = useState<
    {
      id: string;
      nomor: string;
      uraian: string;
      tanggal: Date;
      tmt: Date;
      jenjang: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (limit) searchParams.append("offset", (currentPage - 1).toString());
        const { jenjang, status } = filter;
        const { search } = searchs;
        if (jenjang) searchParams.append("jenjang", jenjang);
        if (status) searchParams.append("status", status);
        if (search) searchParams.append("search", search);
        const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan?${searchParams}`, {
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
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, filter, currentPage, searchs, limit, addNotification, setTotalPage]);

  return (
    <ContainerCard
      title="Daftar SK Mutasi"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) => setSearchsTerm({ search: e.target.value })}
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nomor/Perihal"
            value={searchsTerm.search || ""}
          />
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setFilter({ jenjang: e.target.value })}
            value={filter.jenjang || ""}
          >
            <option value="" defaultChecked>
              Semua Jenjang
            </option>
            <option value="Eselon I">Eselon I</option>
            <option value="Eselon II">Eselon II</option>
            <option value="Eselon III">Eselon III</option>
            <option value="Eselon IV">Eselon IV</option>
            <option value="Jabatan Fungsional">Jabatan Fungsional</option>
            <option value="Pelaksana">Pelaksana</option>
            <option value="Pensiunan">Pensiunan</option>
          </select>
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setFilter({ status: e.target.value })}
            value={filter.status || ""}
          >
            <option value="" defaultChecked>
              Semua Status
            </option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISH">Publish</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          {data.map((row) => (
            <ExpandableItemCard
              key={row.id}
              title={row.nomor}
              subtitle={
                <>
                  <ul>
                    <li>
                      <span className="font-semibold">Tanggal:</span>{" "}
                      {new Date(row.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </li>
                    <li>
                      <span className="font-semibold">Perihal:</span> {row.uraian}
                    </li>
                  </ul>
                </>
              }
              detail={
                <ul>
                  <li>
                    <span className="font-semibold">Jenjang:</span> {row.jenjang}
                  </li>
                  <li>
                    <span className="font-semibold">TMT:</span>{" "}
                    {new Date(row.tmt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
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
              <div className="max-w-full px-4">
                <div
                  className="flex min-w-max justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tooltip" data-tip="Pegawai">
                    <Link href={`/mutasi/sdm/arsip/${row.id}/pegawai`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon className="hover:scale-110" icon="PeopleArrows" height={16} />
                      </div>
                    </Link>
                  </div>
                  <div className="tooltip" data-tip="File">
                    <div className="rounded-box bg-info/80 p-1 text-info-content">
                      <Link href={`/mutasi/sdm/arsip/${row.id}/file`}>
                        <Icon className="hover:scale-110" icon="File" height={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableItemCard>
          ))}
        </div>
      </div>
    </ContainerCard>
  );
}
