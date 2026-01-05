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
  const { input, setInput, getValidationError, setValidationErrors } = useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Faq`, {
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
        title: "Data FAQ",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Data FAQ",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tambah Data FAQ"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Kode --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Question</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="question"
              className={`input-bordered input w-full pl-10 ${getValidationError("question") ? "input-error" : ""}`}
              value={input.question || ""}
              onChange={(e) => setInput({ ...input, question: e.target.value })}
              required
            />
          </div>
          {getValidationError("question") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} /> {getValidationError("question")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nama --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Answer</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="answer"
              className={`input-bordered input w-full pl-10 ${getValidationError("answer") ? "input-error" : ""}`}
              value={input.answer || ""}
              onChange={(e) => setInput({ ...input, answer: e.target.value })}
              required
            />
          </div>
          {getValidationError("answer") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} /> {getValidationError("answer")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
