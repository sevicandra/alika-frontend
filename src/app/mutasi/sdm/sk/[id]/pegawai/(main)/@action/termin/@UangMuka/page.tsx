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
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/ProcessTermin`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            ...input,
            type: "UANG_MUKA",
          }),
        },
      );
      const { message, error } = await res.json();
      if (!res.ok) {
        console.log(error);
        
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
    <form onSubmit={submitForm}>
      <div className="">
        <div className="p-4">
          {/* --- Field Persentase --- */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Persentase:</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="FileText" height={20} />
              </span>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                className={`input-bordered input w-full pl-10 ${getValidationError("percentage") ? "input-error" : ""}`}
                placeholder="Masukkan percentage"
                name="percentage"
                autoComplete="off"
                value={input.percentage || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  if (/^\d*\.?\d*$/.test(value)) {
                    if (parseInt(value) > 100) {
                      setInput({ ...input, percentage: 100 });
                    } else if (parseInt(value) < 0) {
                      setInput({ ...input, percentage: 0 });
                    } else {
                      setInput({ ...input, percentage: Number(value) });
                    }
                  }
                }}
              />
            </div>
            {getValidationError("percentage") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("percentage")}
                </span>
              </label>
            )}
          </div>

          {/* --- Field Maximum --- */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Maksimum:</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="FileText" height={20} />
              </span>
              <input
                type="text"
                inputMode="numeric"
                className={`input-bordered input w-full pl-10 ${getValidationError("maximum") ? "input-error" : ""}`}
                placeholder="Masukkan harga satuan"
                name="maximum"
                autoComplete="off"
                value={
                  input.maximum ? input.maximum.toLocaleString("id-ID") : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^\d]/g, "");
                  const numericValue = Number(rawValue);
                  if (!isNaN(numericValue)) {
                    setInput({ ...input, maximum: numericValue });
                  }
                }}
              />
            </div>
            {getValidationError("maximum") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("maximum")}
                </span>
              </label>
            )}
          </div>

          {/* --- Field Tahun Uang Muka --- */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Tahun Anggaran Uang Muka:
              </span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="FileText" height={20} />
              </span>
              <input
                type="text"
                inputMode="numeric"
                className={`input-bordered input w-full pl-10 ${getValidationError("tahun_uang_muka") ? "input-error" : ""}`}
                placeholder="Masukkan harga satuan"
                name="tahun_uang_muka"
                autoComplete="off"
                value={input.tahun_uang_muka || ""}
                onChange={(e) => {
                  setInput({ ...input, tahun_uang_muka: e.target.value });
                }}
              />
            </div>
            {getValidationError("tahun_uang_muka") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("tahun_uang_muka")}
                </span>
              </label>
            )}
          </div>

          {/* --- Field Tahun Pelunasan --- */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Tahun Anggaran Pelunasan:
              </span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="FileText" height={20} />
              </span>
              <input
                type="text"
                inputMode="numeric"
                className={`input-bordered input w-full pl-10 ${getValidationError("tahun_lunas") ? "input-error" : ""}`}
                placeholder="Masukkan harga satuan"
                name="tahun_lunas"
                autoComplete="off"
                value={input.tahun_lunas || ""}
                onChange={(e) => {
                  setInput({ ...input, tahun_lunas: e.target.value });
                }}
              />
            </div>
            {getValidationError("tahun_lunas") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("tahun_lunas")}
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
          <button
            type="submit"
            className={`btn btn-success`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Lanjutkan"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
