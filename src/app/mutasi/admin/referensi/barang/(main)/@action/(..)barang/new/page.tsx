"use client";
import { useContext, useState } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page() {
  const { setRefresh } = useTable();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Barang`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil ditambahkan",
        title: "Data Referensi Volume Barang",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Data Referensi Volume Barang",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tambah Referensi Barang"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Golongan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Golongan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="golongan"
              className={`select-bordered select w-full pl-10 ${getValidationError("golongan") ? "select-error" : ""}`}
              required
              value={input.golongan || ""}
              onChange={(e) => setInput({ ...input, golongan: e.target.value })}
            >
              <option disabled value={""}>
                Pilih Golongan
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          {getValidationError("golongan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("golongan")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Status --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Status Tanggungan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="status"
              className={`select-bordered select w-full pl-10 ${getValidationError("status") ? "select-error" : ""}`}
              required
              value={input.status || ""}
              onChange={(e) => setInput({ ...input, status: e.target.value })}
            >
              <option value={""}>Pilih Status</option>
              <option value="TIDAK_BERKELUARGA">Tidak Berkeluarga</option>
              <option value="BERKELUARGA_TANPA_ANAK">
                Berkeluarga Tanpa Anak
              </option>
              <option value="BERKELUARGA_DENGAN_ANAK">
                Berkeluarga Dengan Anak
              </option>
            </select>
          </div>
          {getValidationError("status") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("status")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Volume --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Volume</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="volume"
              className={`input-bordered input w-full pl-10 ${getValidationError("volume") ? "input-error" : ""}`}
              value={input.volume ? input.volume.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = Number(rawValue);
                if (!isNaN(numericValue)) {
                  setInput({ ...input, volume: numericValue });
                }
              }}
              required
            />
          </div>
          {getValidationError("volume") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("volume")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
