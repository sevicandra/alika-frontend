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
    id: string;
  }>;
}) {
  const { setRefresh } = useTable();
  const { id } = use(params);
  const [error, setError] = useState<Error | null>(null);
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
  const [kotaAsal, setKotaAsal] = useState<
    {
      kode: string;
      kota: string;
    }[]
  >([]);
  const [kotaTujuan, setKotaTujuan] = useState<
    {
      kode: string;
      kota: string;
    }[]
  >([]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Kapal/${id}`, {
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
        title: "Data Rute Kapal",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Rute Kapal",
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
        const res = await fetch(`/api/Mutasi/Admin/Referensi/Kapal/${id}`, {
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
          title: "Referensi Rute Kapal",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setInput]);

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
        const { error, data } = await res.json();
        if (!res.ok) {
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
          title: "Referensi Wilayah",
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
          `/api/Mutasi/Referensi/Wilayah/${input.provinsi_asal}`,
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
        setKotaAsal(data);
      } catch (error) {
        addNotification({
          title: "Referensi Kota",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (input.provinsi_asal) {
      fetchData();
    }
  }, [input.provinsi_asal]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Referensi/Wilayah/${input.provinsi_tujuan}`,
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
        setKotaTujuan(data);
      } catch (error) {
        addNotification({
          title: "Referensi Kota",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (input.provinsi_tujuan) {
      fetchData();
    }
  }, [input.provinsi_tujuan]);

  if (error) throw error;
  return (
    <Form
      title="Ubah Rute Kapal"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Rute --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Rute</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="rute"
              className={`input-bordered input w-full pl-10 ${getValidationError("rute") ? "input-error" : ""}`}
              value={input.rute || ""}
              onChange={(e) => setInput({ ...input, rute: e.target.value })}
              required
            />
          </div>
          {getValidationError("rute") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("rute")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kapal --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Kapal</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="kapal"
              className={`input-bordered input w-full pl-10 ${getValidationError("kapal") ? "input-error" : ""}`}
              value={input.kapal || ""}
              onChange={(e) => setInput({ ...input, kapal: e.target.value })}
              required
            />
          </div>
          {getValidationError("kapal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kapal")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Provinsi Asal --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Provinsi Asal</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="provinsi_asal"
              className={`select-bordered select w-full pl-10 ${getValidationError("provinsi_asal") ? "select-error" : ""}`}
              required
              value={input.provinsi_asal || ""}
              onChange={(e) =>
                setInput({ ...input, provinsi_asal: e.target.value })
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
          {getValidationError("provinsi_asal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("provinsi_asal")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Kota Tujuan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Kota</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="kota_asal"
              className={`select-bordered select w-full pl-10 ${getValidationError("kota_asal") ? "select-error" : ""}`}
              required
              value={input.kota_asal || ""}
              onChange={(e) =>
                setInput({ ...input, kota_asal: e.target.value })
              }
            >
              <option value={""}>Pilih Kota</option>
              {kotaAsal.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.kota}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("kota_asal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kota_asal")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Provinsi Tujuan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Provinsi Tujuan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="provinsi_tujuan"
              className={`select-bordered select w-full pl-10 ${getValidationError("provinsi_tujuan") ? "select-error" : ""}`}
              required
              value={input.provinsi_tujuan || ""}
              onChange={(e) =>
                setInput({ ...input, provinsi_tujuan: e.target.value })
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
          {getValidationError("provinsi_tujuan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("provinsi_tujuan")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kode Kota Tujuan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Kota</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="kota_tujuan"
              className={`select-bordered select w-full pl-10 ${getValidationError("kota_tujuan") ? "select-error" : ""}`}
              required
              value={input.kota_tujuan || ""}
              onChange={(e) =>
                setInput({ ...input, kota_tujuan: e.target.value })
              }
            >
              <option value={""}>Pilih Kota</option>
              {kotaTujuan.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.kota}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("kota_tujuan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kota_tujuan")}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Tarif --- */}
        <div className="form-control col-span-2">
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
                {getValidationError("tarif")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
