"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{ service_kode: string }>;
}) {
  const { service_kode } = use(params);
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
      const res = await fetch(`/api/Sso/Service/${service_kode}/Jabatan`, {
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
        title: "Create Jabatan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Create Jabatan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      title="Tambah Jabatan"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Kode Satker --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Kode Satker</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kode_satker"
              className={`input-bordered input w-full pl-10 ${getValidationError("kode_satker") ? "input-error" : ""}`}
              value={input.kode_satker || ""}
              onChange={(e) => {
                setInput({ ...input, kode_satker: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("kode_satker") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("kode_satker")}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Organisasi --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Kode Organisasi</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kode_organisasi"
              className={`input-bordered input w-full pl-10 ${getValidationError("kode_organisasi") ? "input-error" : ""}`}
              value={input.kode_organisasi || ""}
              onChange={(e) => {
                setInput({ ...input, kode_organisasi: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("kode_organisasi") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("kode_organisasi")}</span>
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Organisasi --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Kode Jabatan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kode_jabatan"
              className={`input-bordered input w-full pl-10 ${getValidationError("kode_jabatan") ? "input-error" : ""}`}
              value={input.kode_jabatan || ""}
              onChange={(e) => {
                setInput({ ...input, kode_jabatan: e.target.value });
              }}
              required
            />
          </div>
          {getValidationError("kode_jabatan") && (
            <label className="label">
              <span className="label-text-alt grid grid-cols-[auto_1fr] items-center gap-2 pt-1 text-sm text-error">
                <span>
                  <Icon icon="CircleAlert" height={16} />{" "}
                </span>
                <span>{getValidationError("kode_jabatan")}</span>
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
            placeholder="Deskripsi Jabatan"
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
