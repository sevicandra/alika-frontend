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
      const res = await fetch(`/api/Sso/Client`, {
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
        const { error } = await res.json();
        if (res.status === 422) {
          const errorArray: { field: string; message: string }[] =
            Object.entries(error.details).map(([field, message]) => ({
              field,
              message: message as string,
            }));
          setValidationErrors(errorArray);
        }
        throw new Error(error.message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil ditabahkan",
        title: "Client",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Client",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      title="Tambah Client"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Client ID --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Client ID</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="id"
              className={`input-bordered input w-full pl-10 ${getValidationError("client_id") ? "input-error" : ""}`}
              value={input.client_id || ""}
              onChange={(e) => {
                setInput({ ...input, client_id: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("client_id") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("client_id")?.message}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Client Secret --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Client Secret</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="password"
              name="secret"
              className={`input-bordered input w-full pl-10 ${getValidationError("client_secret") ? "input-error" : ""}`}
              value={input.client_secret || ""}
              onChange={(e) => {
                setInput({ ...input, client_secret: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("client_secret") && (
            <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
              <span>
                <Icon icon="CircleAlert" height={16} />{" "}
              </span>
              <span>{getValidationError("client_secret")?.message}</span>
            </span>
          )}
        </div>
        {/* --- Field Re Client Secret --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Re Client Secret</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="password"
              name="re_client_secret"
              className={`input-bordered input w-full pl-10 ${getValidationError("re_client_secret") ? "input-error" : ""}`}
              value={input.re_client_secret || ""}
              onChange={(e) => {
                setInput({ ...input, re_client_secret: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("re_client_secret") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("re_client_secret")?.message}</span>
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
