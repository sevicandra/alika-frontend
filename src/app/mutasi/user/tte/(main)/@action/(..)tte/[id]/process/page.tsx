"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import { useTable } from "@/context/table.context";
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
  const { setRefresh } = useTable();
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [passpharse, setPasspharse] = useState("");
  const [tanggal, setTanggal] = useState("");
  const { addNotification } = useNotification();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/Mutasi/Pegawai/TTE/${id}/Process`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          passphrase: passpharse,
          tanggal: tanggal,
        }),
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message);
      }
      addNotification({
        message: `berhasil ditandatangani`,
        title: "Dokumen SPD",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Dokumen SPD",
        variant: "error",
      });
    }
  }

  return (
    <form onSubmit={submitForm}>
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tanggal</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  type="date"
                  name="tanggal"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                  required
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                  }}
                />
              </div>
              {getValidationError("tanggal") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tanggal")?.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Passpharse</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="Key" height={20} />
                </span>
                <input
                  type="password"
                  name="passpharse"
                  className={`input-bordered input w-full pl-10 ${getValidationError("passpharse") ? "input-error" : ""}`}
                  required
                  value={passpharse}
                  onChange={(e) => {
                    setPasspharse(e.target.value);
                  }}
                />
              </div>
              {getValidationError("passpharse") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("passpharse")?.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <div className="relative flex gap-2">
                <input
                  type="checkbox"
                  name="passpharse"
                  className="checkbox"
                  required
                />
                <label className="label">
                  <span className="label-text text-justify text-wrap">
                    Dengan ini saya menyatakan bahwa pegawai yang bersangkutan
                    benar akan berangkat dari kantor asal/telah sampai di kantor
                    Tujuan
                  </span>
                </label>
              </div>
              {getValidationError("passpharse") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("passpharse")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Kirim
          </button>
        </div>
      </div>
    </form>
  );
}
