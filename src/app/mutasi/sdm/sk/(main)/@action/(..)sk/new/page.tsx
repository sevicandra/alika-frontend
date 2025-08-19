"use client";
import { useState } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page() {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { setRefresh } = useSk();
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);

  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };

  async function submitForm(formData: FormData) {
    try {
      setValidationErrors([]);
      const res = await fetch("/api/Mutasi/SDM/SuratKeputusan", {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422) {
          setValidationErrors(data.errors);
        }
        throw new Error(data.message || "Terjadi kesalahan pada server.");
      }

      addNotification({
        message: `Surat Keputusan berhasil dibuat (Status: ${res.status})`,
        title: "Sukses",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Gagal",
      });
    }
  }

  return (
    <form action={submitForm} noValidate>
      <div className=" bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {/* --- Field Nomor SK --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nomor SK</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/50 z-10">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="nomor"
                  className={`input-bordered input w-full pl-10 ${getValidationError("nomor") ? "input-error" : ""}`}
                  placeholder="Contoh: 821.2/01-SK/2024"
                  required
                />
              </div>
              {getValidationError("nomor") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("nomor")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Jenjang --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Jenjang</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/50 z-10">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="jenjang"
                  className={`select-bordered select w-full pl-10 ${getValidationError("jenjang") ? "select-error" : ""}`}
                  required
                  defaultValue=""
                >
                  <option disabled value={""}>
                    Pilih Jenjang
                  </option>
                  <option value={"ESELON I"}>ESELON I</option>
                  <option value={"ESELON II"}>ESELON II</option>
                  <option value={"ESELON III"}>ESELON III</option>
                  <option value={"JABATAN FUNGSIONAL"}>
                    JABATAN FUNGSIONAL
                  </option>
                  <option value={"PELAKSANA"}>PELAKSANA</option>
                  <option value={"PENSIUNAN"}>PENSIUNAN</option>
                </select>
              </div>
              {getValidationError("jenjang") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("jenjang")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Uraian --- */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Uraian</span>
              </label>
              <textarea
                name="uraian"
                className={`textarea-bordered textarea h-24 w-full ${getValidationError("uraian") ? "textarea-error" : ""}`}
                placeholder="Tentang dari Surat Keputusan..."
                required
              ></textarea>
              {getValidationError("uraian") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("uraian")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Tanggal --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Tanggal Ditetapkan
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/50 z-10">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tanggal"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                  required
                />
              </div>
              {getValidationError("tanggal") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tanggal")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field TMT --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Tanggal Mulai Berlaku (TMT)
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/50 z-10">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tmt"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tmt") ? "input-error" : ""}`}
                  required
                />
              </div>
              {getValidationError("tmt") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tmt")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field File SK --- */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Unggah File SK</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/50 z-10">
                  <Icon icon="Upload" height={20} />
                </span>
                <input
                  name="file"
                  type="file"
                  className={`file-input-bordered file-input w-full pl-10 ${getValidationError("file") ? "file-input-error" : ""}`}
                  accept="application/pdf"
                  required
                />
              </div>
              {getValidationError("file") ? (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("file")?.message}
                  </span>
                </label>
              ) : (
                <label className="label">
                  <span className="label-text-alt">
                    Format file: PDF, Ukuran maksimal: 50MB
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Buat Surat Keputusan
          </button>
        </div>
      </div>
    </form>
  );
}
