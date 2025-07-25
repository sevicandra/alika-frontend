"use client";
import { useContext, useEffect, useState, use, useRef } from "react";
import { NotificationContext } from "@/context/notifikasi";
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
  const [error, setError] = useState<Error | null>(null);
  const { setRefresh } = usePayroll();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id, termin_id } = use(params);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Keuangan/Payroll/${id}/Termin/${termin_id}/Rekening`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "PATCH",
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
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Keuangan/Payroll/${id}/Termin/${termin_id}/Rekening`,
          {
            method: "GET",
          },
        );
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
  }, []);

  if (error) throw error;
  return (
    <Form
      title="Edit Payroll"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Nama Rekening --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama Rekening</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nama_rekening"
              className={`input-bordered input w-full pl-10 ${getValidationError("nama_rekening") ? "input-error" : ""}`}
              value={input.nama_rekening || ""}
              onChange={(e) =>
                setInput({ ...input, nama_rekening: e.target.value })
              }
              required
            />
          </div>
          {getValidationError("nama_rekening") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nama_rekening")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nomor Rekening --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nomor Rekening</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nomor_rekening"
              className={`input-bordered input w-full pl-10 ${getValidationError("nomor_rekening") ? "input-error" : ""}`}
              value={input.nomor_rekening || ""}
              onChange={(e) =>
                setInput({ ...input, nomor_rekening: e.target.value })
              }
              required
            />
          </div>
          {getValidationError("nomor_rekening") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nomor_rekening")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nama Bank --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama Bank</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nama_bank"
              className={`input-bordered input w-full pl-10 ${getValidationError("nama_bank") ? "input-error" : ""}`}
              value={input.nama_bank || ""}
              onChange={(e) =>
                setInput({ ...input, nama_bank: e.target.value })
              }
              required
            />
          </div>
          {getValidationError("nama_bank") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nama_bank")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
