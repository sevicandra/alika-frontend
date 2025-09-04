"use client";
import { useEffect, useState, use, useRef } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [error, setError] = useState<Error | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const [data, setData] = useState<{
    nomor: string;
    uraian: string;
    tanggal: Date | null;
    tmt: Date | null;
    jenjang: string;
    file: File | null;
  }>({
    nomor: "",
    uraian: "",
    tanggal: null,
    tmt: null,
    jenjang: "",
    file: null,
  });
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nomor", data.nomor);
    formData.append("uraian", data.uraian);
    formData.append(
      "tanggal",
      data.tanggal ? new Date(data.tanggal).toISOString().slice(0, 10) : "",
    );
    formData.append(
      "tmt",
      data.tmt ? new Date(data.tmt).toISOString().slice(0, 10) : "",
    );
    formData.append("jenjang", data.jenjang);
    if (data.file) {
      formData.append("file", data.file);
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil di ubah",
        title: "Surat Keputusan",
      });
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
      router.back();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setData({
          nomor: data.nomor,
          uraian: data.uraian,
          tanggal: new Date(data.tanggal),
          tmt: new Date(data.tmt),
          jenjang: data.jenjang,
          file: null,
        });
      } catch (error) {
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (error) throw error;
  return (
    <form onSubmit={submitForm} noValidate>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {/* --- Field Nomor SK --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nomor SK</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="nomor"
                  className={`input-bordered input w-full pl-10 ${getValidationError("nomor") ? "input-error" : ""}`}
                  placeholder="Contoh: 821.2/01-SK/2024"
                  value={data.nomor}
                  onChange={(e) => setData({ ...data, nomor: e.target.value })}
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
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="jenjang"
                  className={`select-bordered select w-full pl-10 ${getValidationError("jenjang") ? "select-error" : ""}`}
                  value={data.jenjang}
                  onChange={(e) =>
                    setData({ ...data, jenjang: e.target.value })
                  }
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
                value={data.uraian}
                onChange={(e) => setData({ ...data, uraian: e.target.value })}
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
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tanggal"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                  value={
                    data?.tanggal
                      ? new Date(data.tanggal).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setData({ ...data, tanggal: new Date(e.target.value) })
                  }
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
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tmt"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tmt") ? "input-error" : ""}`}
                  value={
                    data?.tmt
                      ? new Date(data.tmt).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setData({ ...data, tmt: new Date(e.target.value) })
                  }
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
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="Upload" height={20} />
                </span>
                <input
                  ref={fileInputRef}
                  name="file"
                  type="file"
                  className={`file-input-bordered file-input w-full pl-10 ${getValidationError("file") ? "file-input-error" : ""}`}
                  accept="application/pdf"
                  onChange={(e) =>
                    setData({ ...data, file: e.target.files?.[0] ?? null })
                  }
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
