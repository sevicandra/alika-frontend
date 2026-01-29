"use client";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("nomor", input.nomor || "");
    formData.append("jenjang", input.jenjang || "");
    formData.append("uraian", input.uraian || "");
    formData.append("tanggal", input.tanggal || "");
    formData.append("tmt", input.tmt || "");
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      setValidationErrors({}); // Reset validation errors
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
      const { message, error } = await res.json();
      if (!res.ok) {
        if (res.status === 422) {
          setValidationErrors(error.details);
        }
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }

      addNotification({
        message: `${message} (Status: ${res.status})`,
        title: "Tambah Surat Keputusan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Tambah Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tambah Surat Keputusan"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
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
              value={input.nomor || ""}
              onChange={(e) => setInput({ ...input, nomor: e.target.value })}
            />
          </div>
          {getValidationError("nomor") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nomor")}
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
              required
              value={input.jenjang || ""}
              onChange={(e) => setInput({ ...input, jenjang: e.target.value })}
            >
              <option disabled value={""}>
                Pilih Jenjang
              </option>
              <option value={"ESELON I"}>ESELON I</option>
              <option value={"ESELON II"}>ESELON II</option>
              <option value={"ESELON III"}>ESELON III</option>
              <option value={"ESELON IV"}>ESELON IV</option>
              <option value={"JABATAN FUNGSIONAL"}>JABATAN FUNGSIONAL</option>
              <option value={"PELAKSANA"}>PELAKSANA</option>
              <option value={"PENSIUNAN"}>PENSIUNAN</option>
            </select>
          </div>
          {getValidationError("jenjang") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("jenjang")}
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
            value={input.uraian || ""}
            onChange={(e) => setInput({ ...input, uraian: e.target.value })}
          ></textarea>
          {getValidationError("uraian") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("uraian")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Tanggal --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Tanggal Ditetapkan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="CalendarDays" height={20} />
            </span>
            <input
              name="tanggal"
              type="date"
              className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
              value={input.tanggal || ""}
              onChange={(e) => setInput({ ...input, tanggal: e.target.value })}
            />
          </div>
          {getValidationError("tanggal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tanggal")}
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
              value={input.tmt || ""}
              onChange={(e) => setInput({ ...input, tmt: e.target.value })}
            />
          </div>
          {getValidationError("tmt") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tmt")}
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
              name="file"
              type="file"
              className={`file-input-bordered file-input w-full pl-10 ${getValidationError("file") ? "file-input-error" : ""}`}
              accept="application/pdf"
              onChange={(e) =>
                setInput({ ...input, file: e.target.files?.[0] })
              }
            />
          </div>
          {getValidationError("file") ? (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("file")}
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
    </Form>
  );
}
