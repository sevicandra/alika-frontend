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
      if (input.secret !== input.resecret) {
        setValidationErrors({
          field: "resecret",
          message: "Secret tidak cocok",
        });
        return;
      }

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
              value={input.id || ""}
              onChange={(e) => {
                setInput({ ...input, id: e.target.value });
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
                <span>{getValidationError("client_id")}</span>
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
              value={input.secret || ""}
              onChange={(e) => {
                setInput({ ...input, secret: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("client_secret") && (
            <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
              <span>
                <Icon icon="CircleAlert" height={16} />{" "}
              </span>
              <span>{getValidationError("client_secret")}</span>
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
              name="resecret"
              className={`input-bordered input w-full pl-10 ${getValidationError("resecret") ? "input-error" : ""}`}
              value={input.resecret || ""}
              onChange={(e) => {
                setInput({ ...input, resecret: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("resecret") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("resecret")}</span>
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
