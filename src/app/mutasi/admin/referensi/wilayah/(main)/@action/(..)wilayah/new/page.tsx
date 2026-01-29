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
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Provinsi`, {
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
      const { error, message } = await res.json();
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
        title: "Referensi Provinsi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Provinsi",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      title="Tambah Provinsi"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Kode Provinsi --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Kode Provinsi</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kode"
              className={`input-bordered input w-full pl-10 ${getValidationError("kode") ? "input-error" : ""}`}
              value={input.kode || ""}
              onChange={(e) => setInput({ ...input, kode: e.target.value })}
              required
            />
          </div>
          {getValidationError("kode") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kode")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nama Provinsi --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama Provinsi</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="provinsi"
              className={`input-bordered input w-full pl-10 ${getValidationError("provinsi") ? "input-error" : ""}`}
              value={input.provinsi || ""}
              onChange={(e) => setInput({ ...input, provinsi: e.target.value })}
              required
            />
          </div>
          {getValidationError("provinsi") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("provinsi")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
