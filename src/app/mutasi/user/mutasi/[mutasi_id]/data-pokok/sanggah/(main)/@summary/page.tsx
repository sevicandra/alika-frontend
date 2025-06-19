"use client";
import { useSanggahContext } from "@/context/mutasi/user";
import { snackToTitleCase } from "@/helpers/string.helper";
import SanggahKeluargaCard from "@/component/Molecules/SanggahKeluargaCard";

export default function SanggahSummary() {
  const { revisi, deleteRevisi } = useSanggahContext();

  const handleDelete = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus revisi ini?")) {
      deleteRevisi(index);
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto px-4 py-2">
      {revisi.map((r, index) => (
        <SanggahKeluargaCard
          key={index}
          action={
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${r.action === "add" ? "bg-success-300 text-success-content" : r.action === "edit" ? "bg-info-300 text-info-content" : "bg-error-300 text-error-content"} `}
            >
              {snackToTitleCase(r.action)}
            </span>
          }
        >
          {r.action === "add" && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <label className="label">Nama</label>
                <p>{r.data.nama.new}</p>
              </div>
              <div>
                <label className="label">NIK</label>
                <p>{r.data.nik.new}</p>
              </div>
              <div>
                <label className="label">Hubungan</label>
                <p>{r.data.hubungan.new}</p>
              </div>
              <div>
                <label className="label">Tanggal Lahir</label>
                <p>{r.data.tanggal_lahir.new}</p>
              </div>
              <div>
                <label className="label">Pekerjaan</label>
                <p>{r.data.pekerjaan.new}</p>
              </div>
              <div>
                <label className="label">Status</label>
                <p>{r.data.status.new}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="label">Catatan</label>
                <p>{r.catatan}</p>
              </div>
            </div>
          )}
          {r.action === "edit" && (
            <div className="flex flex-col gap-2">
              <div className="font-bold">{r.nama}</div>
              {r.data.nama && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">NIK</label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.nama.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.nama.new}</p>
                  </div>
                </div>
              )}
              {r.data.nik && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">NIK</label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.nik.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.nik.new}</p>
                  </div>
                </div>
              )}
              {r.data.hubungan && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">
                    Hubungan
                  </label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.hubungan.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.hubungan.new}</p>
                  </div>
                </div>
              )}
              {r.data.tanggal_lahir && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">
                    Tanggal Lahir
                  </label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.tanggal_lahir.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.tanggal_lahir.new}</p>
                  </div>
                </div>
              )}
              {r.data.pekerjaan && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">
                    Pekerjaan
                  </label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.pekerjaan.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.pekerjaan.new}</p>
                  </div>
                </div>
              )}
              {r.data.status && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="col-span-1 label md:col-span-2">
                    Status
                  </label>
                  <div className="rounded-box bg-error/50 p-4 text-error-content">
                    <label>Data Lama</label>
                    <p>{r.data.status.old || "-"}</p>
                  </div>
                  <div className="rounded-box bg-info/50 p-4 text-info-content">
                    <label>Data Baru</label>
                    <p>{r.data.status.new}</p>
                  </div>
                </div>
              )}
              <div className="col-span-1 md:col-span-2">
                <label className="label">Catatan</label>
                <p>{r.catatan}</p>
              </div>
            </div>
          )}
          {r.action === "remove" && (
            <div className="flex flex-col gap-2">
              <div className="font-bold">{r.nama}</div>
              <div className="col-span-1 md:col-span-2">
                <label className="label">Catatan</label>
                <p>{r.catatan}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => handleDelete(index)}
              className="btn btn-xs btn-error"
            >
              Delete
            </button>
          </div>
        </SanggahKeluargaCard>
      ))}
    </div>
  );
}
