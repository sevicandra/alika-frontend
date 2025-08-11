"use client";
import { useContext, useState, use } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { setRefresh } = useTable();
  const { id } = use(params);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/Client/${id}/Redirect`, {
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
          console.log(errors);
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil ditabahkan",
        title: "Redirect",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Redirect",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      title="Tambah Redirect"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field URL --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">URL</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="uri"
              className={`input-bordered input w-full pl-10 ${getValidationError("uri") ? "input-error" : ""}`}
              value={input.uri || ""}
              onChange={(e) => {
                setInput({ ...input, uri: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("uri") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("uri")?.message}</span>
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
