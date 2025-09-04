"use client";
import { use, useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import SanggahKeluargaCard from "@/component/Molecules/SanggahKeluargaCard";
import Loading from "@/component/Molecules/Loading";
import { snackToTitleCase } from "@/helpers/string.helper";
import { PengajuanSanggah, ReviewSanggah } from "@/type/pembayaranLog";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string; riwayat_id: string }>;
}) {
  const { mutasi_id, riwayat_id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    | {
        action_type: "SANGGAHAN_DIAJUKAN";
        payload: PengajuanSanggah[];
      }
    | {
        action_type: "SANGGAHAN_DIREVIEW";
        payload: ReviewSanggah[];
      }
  >({
    action_type: "SANGGAHAN_DIREVIEW",
    payload: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/History/${riwayat_id}`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          title: `Preview Dokumen`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, mutasi_id, riwayat_id]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-box text-neutral-content shadow">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      <div className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-2">
        {data?.payload.map((r, index) => (
          <SanggahKeluargaCard
            key={index}
            action={
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${r.action === "ADD" ? "bg-success-300 text-success-content" : r.action === "EDIT" ? "bg-info-300 text-info-content" : "bg-error-300 text-error-content"} `}
              >
                {snackToTitleCase(r.action)}
              </span>
            }
          >
            {r.action === "ADD" && (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <label className="label">Nama</label>
                  <p>{r.data?.nama?.new}</p>
                </div>
                <div>
                  <label className="label">NIK</label>
                  <p>{r.data?.nik?.new}</p>
                </div>
                <div>
                  <label className="label">Hubungan</label>
                  <p>{r.data?.hubungan?.new}</p>
                </div>
                <div>
                  <label className="label">Tanggal Lahir</label>
                  <p>{r.data?.tanggal_lahir?.new}</p>
                </div>
                <div>
                  <label className="label">Pekerjaan</label>
                  <p>{r.data?.pekerjaan?.new}</p>
                </div>
                <div>
                  <label className="label">Status</label>
                  <p>{r.data?.status?.new}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="label">Catatan</label>
                  <p>{r.catatan}</p>
                </div>
              </div>
            )}
            {r.action === "EDIT" && (
              <div className="flex flex-col gap-2">
                <div className="font-bold">{r.nama}</div>
                {r.data?.nama && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      NIK
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.nama.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.nama.new}</p>
                    </div>
                  </div>
                )}
                {r.data?.nik && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      NIK
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.nik.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.nik.new}</p>
                    </div>
                  </div>
                )}
                {r.data?.hubungan && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      Hubungan
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.hubungan.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.hubungan.new}</p>
                    </div>
                  </div>
                )}
                {r.data?.tanggal_lahir && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      Tanggal Lahir
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.tanggal_lahir.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.tanggal_lahir.new}</p>
                    </div>
                  </div>
                )}
                {r.data?.pekerjaan && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      Pekerjaan
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.pekerjaan.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.pekerjaan.new}</p>
                    </div>
                  </div>
                )}
                {r.data?.status && (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="col-span-1 label md:col-span-2">
                      Status
                    </label>
                    <div className="rounded-box bg-error/50 p-4 text-error-content">
                      <label>Data Lama</label>
                      <p>{r.data?.status.old || "-"}</p>
                    </div>
                    <div className="rounded-box bg-info/50 p-4 text-info-content">
                      <label>Data Baru</label>
                      <p>{r.data?.status.new}</p>
                    </div>
                  </div>
                )}
                <div className="col-span-1 md:col-span-2">
                  <label className="label">Catatan</label>
                  <p>{r.catatan}</p>
                </div>
              </div>
            )}
            {r.action === "REMOVE" && (
              <div className="flex flex-col gap-2">
                <div className="font-bold">{r.nama}</div>
                <div className="col-span-1 md:col-span-2">
                  <label className="label">Catatan</label>
                  <p>{r.catatan}</p>
                </div>
              </div>
            )}
            {data.action_type === "SANGGAHAN_DIREVIEW" && (
              <span
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-4 text-center ${(r as ReviewSanggah).confrimation ? "border-info/50" : "border-error/50"}`}
              >
                <p
                  className={`text-6xl font-black uppercase ${(r as ReviewSanggah).confrimation ? "text-info/50" : "text-error/50"}`}
                >
                  {(r as ReviewSanggah).confrimation ? "Disetujui" : "Di Tolak"}
                </p>
              </span>
            )}
          </SanggahKeluargaCard>
        ))}
      </div>
    </div>
  );
}
