"use client";
import { useContext, useEffect, useState, use } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { setRefresh } = useTable();
  const { id } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [provinsi, setProvinsi] = useState<
    {
      kode: string;
      provinsi: string;
    }[]
  >([]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/UangHarian/${id}`, {
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
        title: "Referensi Uang Harian",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Uang Harian",
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
        const res = await fetch(
          `/api/Mutasi/Admin/Referensi/UangHarian/${id}`,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInput({
          ...input,
          kode_kota: "",
        });
        setLoading(true);
        const res = await fetch(`/api/Mutasi/Referensi/Wilayah`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setProvinsi(data);
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
      title="Ubah Referensi Uang Harian"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Kode Provinsi --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Provinsi</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="kode_provinsi"
              className={`select-bordered select w-full pl-10 ${getValidationError("kode_provinsi") ? "select-error" : ""}`}
              required
              value={input.kode_provinsi || ""}
              onChange={(e) =>
                setInput({ ...input, kode_provinsi: e.target.value })
              }
            >
              <option disabled value={""}>
                Pilih Provinsi
              </option>
              {provinsi.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.provinsi}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("kode_provinsi") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kode_provinsi")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Tarif --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Tarif</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="tarif"
              className={`input-bordered input w-full pl-10 ${getValidationError("tarif") ? "input-error" : ""}`}
              value={input.tarif ? input.tarif.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = Number(rawValue);
                if (!isNaN(numericValue)) {
                  setInput({ ...input, tarif: numericValue });
                }
              }}
              required
            />
          </div>
          {getValidationError("tarif") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tarif")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
