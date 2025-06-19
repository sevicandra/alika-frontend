"use client";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import SanggahKeluargaCard from "@/component/Molecules/SanggahKeluargaCard";
import { useSanggahDetail } from "@/context/mutasi/sdm";
import { useSanggah } from "@/context/mutasi/sdm";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: sanggah } = useSanggahDetail();
  const { setRefresh } = useSanggah();
  const { addNotification } = useNotification();
  const [reviewData, setReviewData] = useState<
    { id: string; is_approved?: boolean; admin_notes?: string }[]
  >([]);

  const { id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      sanggah_id: string;
      action: "EDIT" | "REMOVE" | "ADD";
      keluarga_id: string;
      new_value: {
        nik?: {
          new: string;
          old?: string;
        };
        nama?: {
          new: string;
          old?: string;
        };
        hubungan?: {
          new: string;
          old?: string;
        };
        tanggal_lahir?: {
          new: string;
          old?: string;
        };
        pekerjaan?: {
          new: string;
          old?: string;
        };
        status?: {
          new: string;
          old?: string;
        };
      };
      reason: string;
      is_approved?: boolean;
      file: string | null;
      Ref: {
        id: string;
        hris_id?: number;
        pegawai_id: string;
        nik?: string;
        nama: string;
        hubungan: string;
        tanggal_lahir: Date;
        pekerjaan?: string;
        status: string;
      } | null;
    }[]
  >([]);
  const updateReview = (
    id: string,
    field: "is_approved" | "admin_notes",
    value: boolean | string,
  ) => {
    setReviewData((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, [field]: value } : r));
      } else {
        return [...prev, { id, [field]: value }];
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/Mutasi/SDM/Sanggah/${id}/Data`, {
          method: "GET",
        });

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }

        const { data } = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
        addNotification({
          title: `Review Sanggah`,
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const submitReview = async () => {
    if (confirm("Apakah anda yakin?")) {
      try {
        const res = await fetch(`/api/Mutasi/SDM/Sanggah/${id}/Review`, {
          method: "POST",
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review: reviewData,
          }),
        });

        if (!res.ok) {
          const { message, errors } = await res.json();
          addNotification({
            title: `Review Sanggah`,
            message: JSON.stringify(errors),
          });
          throw new Error(message);
        }
        addNotification({
          title: `Review Sanggah`,
          message: "Review berhasil disimpan",
        });
        setRefresh();
        router.replace(`/mutasi/sdm/sanggah`);
      } catch (error) {
        addNotification({
          title: `Review Sanggah`,
          message: (error as Error).message,
        });
      }
    }
  };

  return (
    <ContainerCard
      title={
        sanggah
          ? `${sanggah.Pegawai.nama.toUpperCase()} / ${sanggah.ticket_number.toUpperCase()}`
          : "Sanggah"
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}

        <div className="overflow-y-auto px-4 py-2">
          {data.map((r, index) => (
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
                    <p>{r.new_value?.nama?.new}</p>
                  </div>
                  <div>
                    <label className="label">NIK</label>
                    <p>{r.new_value?.nik?.new}</p>
                  </div>
                  <div>
                    <label className="label">Hubungan</label>
                    <p>{r.new_value?.hubungan?.new}</p>
                  </div>
                  <div>
                    <label className="label">Tanggal Lahir</label>
                    <p>{r.new_value?.tanggal_lahir?.new}</p>
                  </div>
                  <div>
                    <label className="label">Pekerjaan</label>
                    <p>{r.new_value?.pekerjaan?.new}</p>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <p>{r.new_value?.status?.new}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="label">Catatan</label>
                    <p>{r.reason}</p>
                  </div>
                </div>
              )}
              {r.action === "EDIT" && (
                <div className="flex flex-col gap-2">
                  <div className="font-bold">{r.Ref?.nama}</div>
                  <div className="grid grid-cols-1 gap-2 rounded-box border border-base-100 bg-base-100 p-4 md:grid-cols-2">
                    <p>NIK: {r.Ref?.nik || "-"}</p>
                    <p>
                      Tanggal Lahir:{" "}
                      {r.Ref?.tanggal_lahir
                        ? new Date(r.Ref?.tanggal_lahir).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>Pekerjaan: {r.Ref?.pekerjaan || "-"}</p>
                    <p>Status: {r.Ref?.status || "-"}</p>
                  </div>
                  {r.new_value?.nama && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        NIK
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.nama.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.nama.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value?.nik && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        NIK
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.nik.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.nik.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value?.hubungan && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Hubungan
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.hubungan.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.hubungan.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value?.tanggal_lahir && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Tanggal Lahir
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.tanggal_lahir.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.tanggal_lahir.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value?.pekerjaan && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Pekerjaan
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.pekerjaan.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.pekerjaan.new}</p>
                      </div>
                    </div>
                  )}
                  {r.new_value?.status && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="col-span-1 label md:col-span-2">
                        Status
                      </label>
                      <div className="rounded-box bg-error/50 p-4 text-error-content">
                        <label>Data Lama</label>
                        <p>{r.new_value?.status.old || "-"}</p>
                      </div>
                      <div className="rounded-box bg-info/50 p-4 text-info-content">
                        <label>Data Baru</label>
                        <p>{r.new_value?.status.new}</p>
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
                  <div className="font-bold">{r.Ref?.nama}</div>
                  <div className="grid grid-cols-1 gap-2 rounded-box border border-base-100 bg-base-100 p-4 md:grid-cols-2">
                    <p>NIK: {r.Ref?.nik || "-"}</p>
                    <p>
                      Tanggal Lahir:{" "}
                      {r.Ref?.tanggal_lahir
                        ? new Date(r.Ref?.tanggal_lahir).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>Pekerjaan: {r.Ref?.pekerjaan || "-"}</p>
                    <p>Status: {r.Ref?.status || "-"}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="label">Catatan</label>
                    <p>{r.reason}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={
                        reviewData.find((d) => d.id === r.id)?.is_approved ===
                        true
                      }
                      onChange={() => updateReview(r.id, "is_approved", true)}
                    />
                    <span className="font-medium text-green-600">Setujui</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={
                        reviewData.find((d) => d.id === r.id)?.is_approved ===
                        false
                      }
                      onChange={() => updateReview(r.id, "is_approved", false)}
                    />
                    <span className="font-medium text-red-600">Tolak</span>
                  </label>
                </div>
                {r.file && (
                  <Link
                    href={`/mutasi/sdm/sanggah/${id}/data/${r.id}/file`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Lihat Dokumen
                  </Link>
                )}
              </div>
              <div className="col-span-2">
                <label className="label text-base-content">Catatan:</label>
                <textarea
                  name="catatan"
                  className={`textarea w-full border-base-content/20 bg-base-100 text-base-content focus:outline-none`}
                  placeholder="catatan (opsional)"
                  value={
                    reviewData.find((d) => d.id === r.id)?.admin_notes || ""
                  }
                  onChange={(e) =>
                    updateReview(r.id, "admin_notes", e.target.value)
                  }
                />
              </div>
            </SanggahKeluargaCard>
          ))}
        </div>

        <div className="flex justify-end p-4">
          <button
            type="submit"
            className="btn btn-xs btn-primary"
            onClick={submitReview}
          >
            Simpan
          </button>
        </div>
      </div>
    </ContainerCard>
  );
}
