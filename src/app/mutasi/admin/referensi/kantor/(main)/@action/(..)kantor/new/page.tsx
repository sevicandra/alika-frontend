"use client";
import { useEffect, useState } from "react";
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
  const [provinsi, setProvinsi] = useState<
    {
      kode: string;
      provinsi: string;
    }[]
  >([]);
  const [kota, setKota] = useState<
    {
      kode: string;
      kota: string;
    }[]
  >([]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Kantor`, {
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
        title: "Referensi Kantor",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Kantor",
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
        setInput({
          ...input,
          kode_kota: "",
        });
        const res = await fetch(`/api/Mutasi/Referensi/Wilayah`, {
          method: "GET",
        });
        const { error, data } = await res.json();
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
        setProvinsi(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Referensi Provinsi",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setInput]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Referensi/Wilayah/${input.kode_provinsi}`,
          {
            method: "GET",
          },
        );
        const { data, error } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setKota(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Referensi Kota",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (input.kode_provinsi) {
      fetchData();
    }
  }, [input.kode_provinsi]);

  return (
    <Form
      title="Tambah Kantor"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Kode Satker --- */}
        <div className="form-control">
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
              onChange={(e) =>
                setInput({ ...input, kode_satker: e.target.value })
              }
              required
            />
          </div>
          {getValidationError("kode_satker") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kode_satker")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Nama Satker --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama Satker</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kantor"
              className={`input-bordered input w-full pl-10 ${getValidationError("kantor") ? "input-error" : ""}`}
              value={input.kantor || ""}
              onChange={(e) => setInput({ ...input, kantor: e.target.value })}
              required
            />
          </div>
          {getValidationError("kantor") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kantor")}
              </span>
            </label>
          )}
        </div>
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
                {getValidationError("kode_provinsi")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Kota --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Kota</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="kode_kota"
              className={`select-bordered select w-full pl-10 ${getValidationError("kode_kota") ? "select-error" : ""}`}
              required
              value={input.kode_kota || ""}
              onChange={(e) =>
                setInput({ ...input, kode_kota: e.target.value })
              }
            >
              <option value={""}>Pilih Kota</option>
              {kota.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.kota}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("kode_kota") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kode_kota")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
