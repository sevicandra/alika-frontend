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
  }>;
}) {
  const { setRefresh } = useTable();
  const { service_kode } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/Service/${service_kode}`, {
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
        title: "Service",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Service",
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
        const res = await fetch(`/api/Sso/Service/${service_kode}`, {
          method: "GET",
        });
              const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setInput(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Fetch Service",
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [service_kode, setInput]);

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
                <span>{getValidationError("kode")}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nama --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Nama</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="name"
              className={`input-bordered input w-full pl-10 ${getValidationError("name") ? "input-error" : ""}`}
              value={input.name || ""}
              onChange={(e) => {
                setInput({ ...input, name: e.target.value });
              }}
              required
            />
          </div>

          {getValidationError("name") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("name")}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Deskripsi --- */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Deskripsi</span>
          </label>
          <textarea
            name="description"
            className={`textarea-bordered textarea h-24 w-full ${getValidationError("description") ? "textarea-error" : ""}`}
            placeholder="Tentang dari Surat Keputusan..."
            value={input.description || ""}
            onChange={(e) => {
              setInput({ ...input, description: e.target.value });
            }}
            required
          ></textarea>
          {getValidationError("description") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("description")}</span>
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
