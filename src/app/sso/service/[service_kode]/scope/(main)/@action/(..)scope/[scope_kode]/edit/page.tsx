"use client";
import { useEffect, useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{
    service_kode: string;
    scope_kode: string;
  }>;
}) {
  const { setRefresh } = useTable();
  const { service_kode, scope_kode } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const { input, setInput, getValidationError, setValidationErrors } = useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/Service/${service_kode}/Scope/${scope_kode}`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "PATCH",
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
        message: "Berhasil di ubah",
        title: "Scope",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Scope",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/Service/${service_kode}/Scope/${scope_kode}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setInput(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scope_kode, service_kode, setInput]);

  if (error) throw error;
  return (
    <Form
      title="Ubah Service"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Kode --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Kode</span>
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
              onChange={(e) => {
                setInput({ ...input, kode: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("kode") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("kode")?.message}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Scope --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Scope</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="scope"
              className={`input-bordered input w-full pl-10 ${getValidationError("scope") ? "input-error" : ""}`}
              value={input.scope || ""}
              onChange={(e) => {
                setInput({ ...input, scope: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("scope") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("scope")?.message}</span>
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
