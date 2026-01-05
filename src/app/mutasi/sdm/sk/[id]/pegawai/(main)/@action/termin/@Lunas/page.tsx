"use client";
import { useState, use } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import { useForm } from "@/context/form.context";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { input, setInput, getValidationError, setValidationErrors } = useForm();
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/ProcessTermin`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          type: "LUNAS",
          tahun_lunas: input.tahun_lunas,
        }),
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message);
      }
      addNotification({
        message: "Berhasil di proses",
        title: "Termin",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Termin",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="">
          <div className="p-4">
            {/* --- Field Tahun --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tahun Anggaran:</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="tahun_lunas"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tahun_lunas") ? "input-error" : ""}`}
                  required
                  value={input.tahun_lunas || ""}
                  onChange={(e) => setInput({ ...input, tahun_lunas: e.target.value })}
                  autoComplete="off"
                  placeholder="Masukkan tahun anggaran"
                  inputMode="numeric"
                />
              </div>
              {getValidationError("tahun_lunas") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tahun_lunas")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
            <button
              className="btn btn-ghost"
              onClick={router.back}
              disabled={loading}
              type="button"
            >
              Batal
            </button>
            <button type="submit" className={`btn btn-success`} disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Lanjutkan"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
