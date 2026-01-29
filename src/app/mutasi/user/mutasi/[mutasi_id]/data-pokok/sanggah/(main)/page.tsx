"use client";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ExpandableItemCard from "@/component/Molecules/ExpandableItemCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import Icon from "@/component/Atoms/LabelIcon";
import SanggahKeluargaCard from "@/component/Molecules/SanggahKeluargaCard";
import { useSanggahContext } from "@/context/mutasi/user";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = use(params);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { refresh } = useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah/Data`,
          {
            method: "GET",
          },
        );
        const { data, meta, error } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(data);
        setTotalPage(meta.total_page);
      };

      fetchData();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Sanggah",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [refresh, mutasi_id]);

  return (
    <ContainerCard
      title="Daftar Pengajuan Sanggah"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="flex flex-col gap-2 overflow-y-auto px-4 py-2">
          {data.map((r: any, index: number) => (
            <SanggahKeluargaCard
              key={index}
              action={
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${r.action === "ADD" ? "bg-success-300 text-success-content" : r.action === "EDIT" ? "bg-info-300 text-info-content" : "bg-error-300 text-error-content"} `}
                >
                  {snackToTitleCase(r.action)}
                </span>
              }
              className="border border-accent"
            >
              {r.action === "ADD" && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <label className="label">Nama</label>
                    <p>{r.new_value.nama.new}</p>
                  </div>
                  <div>
                    <label className="label">NIK</label>
                    <p>{r.new_value.nik.new}</p>
                  </div>
                  <div>
                    <label className="label">Hubungan</label>
                    <p>{r.new_value.hubungan.new}</p>
                  </div>
                  <div>
                    <label className="label">Tanggal Lahir</label>
                    <p>{r.new_value.tanggal_lahir.new}</p>
                  </div>
                  <div>
                    <label className="label">Pekerjaan</label>
                    <p>{r.new_value.pekerjaan.new}</p>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <p>{r.new_value.status.new}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="label">Catatan</label>
                    <p>{r.reason}</p>
                  </div>
                </div>
              )}
              {r.action === "EDIT" && (
                <div className="flex flex-col gap-2">
                  <div className="font-bold">
                    {r.Ref.nama} / {r.Ref.nik}
                  </div>
                  {r.new_value.nama && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Nama
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.nama.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.nama.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value.nik && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        NIK
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.nik.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.nik.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value.hubungan && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Hubungan
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.hubungan.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.hubungan.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value.tanggal_lahir && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Tanggal Lahir
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.tanggal_lahir.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.tanggal_lahir.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value.pekerjaan && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Pekerjaan
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.pekerjaan.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.pekerjaan.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value.status && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Status
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value.status.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value.status.new}</p>
                      </div>
                    </div>
                  )}
                  <div className="col-span-1 md:col-span-2">
                    <label className="label">Catatan</label>
                    <p>{r.reason}</p>
                  </div>
                </div>
              )}
              {r.action === "REMOVE" && (
                <div className="flex flex-col gap-2">
                  <div className="font-bold">
                    {r.Ref.nama} / {r.Ref.nik}
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="label">Catatan</label>
                    <p>{r.catatan}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Link
                  className="btn btn-xs btn-error"
                  href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/sanggah/${r.id}/hapus`}
                >
                  Delete
                </Link>
              </div>
            </SanggahKeluargaCard>
          ))}
        </div>
      </div>
    </ContainerCard>
  );
}
