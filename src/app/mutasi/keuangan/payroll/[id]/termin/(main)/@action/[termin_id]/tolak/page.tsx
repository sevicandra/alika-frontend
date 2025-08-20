"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { usePayroll } from "@/context/mutasi/keu";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; termin_id: string }>;
}) {
  const { setRefresh } = usePayroll();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id, termin_id } = use(params);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Keuangan/Payroll/${id}/Termin/${termin_id}/Tolak`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify(input),
        },
      );
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
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      title="Tolak Payroll"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="destructive"
      confirmText="Tolak"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Uraian --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Catatan</span>
          </label>
          <textarea
            name="catatan"
            className={`textarea-bordered textarea h-24 w-full ${getValidationError("catatan") ? "textarea-error" : ""}`}
            placeholder="Catatan..."
            required
            value={input.catatan || ""}
            onChange={(e) => setInput({ ...input, catatan: e.target.value })}
          ></textarea>
          {getValidationError("catatan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("catatan")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
