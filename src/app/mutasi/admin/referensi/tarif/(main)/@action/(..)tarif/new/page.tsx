"use client";
import { useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page() {
  const { setRefresh } = useTable();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Tarif`, {
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
        title: "Referensi Tarif",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Tarif",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tambah Referensi Tarif"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Jenis --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Jenis</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="jenis"
              className={`select-bordered select w-full pl-10 ${getValidationError("jenis") ? "select-error" : ""}`}
              required
              value={input.jenis || ""}
              onChange={(e) => setInput({ ...input, jenis: e.target.value })}
            >
              <option disabled value={""}>
                Pilih jenis
              </option>
              <option value="TRANSPORT_DARAT_ORANG">
                Transport Darat Orang
              </option>
              <option value="TRANSPORT_DARAT_BARANG">
                Transport Darat Barang
              </option>
              <option value="PACKING_DARAT">Packing Darat</option>
              <option value="PACKING_LAUT">Packing Laut</option>
              <option value="PACKING_UDARA">Packing Udara</option>
              <option value="UANG_HARIAN">Uang Harian</option>
            </select>
          </div>
          {getValidationError("jenis") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("jenis")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Tarif --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Tarif</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="tarif"
              className={`input-bordered input w-full pl-10 ${getValidationError("tarif") ? "input-error" : ""}`}
              value={input.tarif ? input.tarif.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = Number(rawValue);
                if (!isNaN(numericValue)) {
                  setInput({ ...input, tarif: numericValue });
                }
              }}
              required
            />
          </div>
          {getValidationError("tarif") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tarif")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
