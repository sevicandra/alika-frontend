"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Form from "@/component/Organisms/Form";
import { useForm } from "@/context/form.context";
import Icon from "@/component/Atoms/LabelIcon";
import { snackToTitleCase } from "@/helpers/string.helper";
import { SearchableSelect } from "@/component/Molecules/InputForm";

export default function Page() {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const [data, setData] = useState<{ jenis: string; total: number }[]>();
  const [kantor, setKantor] = useState<
    {
      kode_satker: string;
      kantor: string;
    }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/Mutasi/Referensi/Kantor`);
        if (!res.ok) {
          throw new Error("Gagal memuat data estimasi.");
        }
        const { data } = await res.json();

        setKantor(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Refensi Kantor",
          variant: "error",
        });
      }
    }
    fetchData();
  }, []);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setValidationErrors([]);
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Pegawai/Dashboard/Estimasi`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      const result = await res.json();
      setData(result.data);
      addNotification({
        message: "Estimasi biaya berhasil dihitung.",
        title: "Estimasi Biaya",
        variant: "success",
      });
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Estimasi Biaya",
        variant: "error",
      });
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Estimasi Biaya"
      onCancel={() => router.back()}
      submitForm={(e) => submitForm(e)}
      loading={loading}
      variant="positive"
      confirmText="Hitung"
      cancelText="Kembali"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Golongan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Golongan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="golongan"
              className={`select-bordered select w-full pl-10 ${getValidationError("golongan") ? "select-error" : ""}`}
              required
              value={input.golongan || ""}
              onChange={(e) => setInput({ ...input, golongan: e.target.value })}
            >
              <option disabled value={""}>
                Pilih Golongan
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          {getValidationError("golongan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("golongan")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Pasangan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Pasangan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="pasangan"
              className={`select-bordered select w-full pl-10 ${getValidationError("pasangan") ? "select-error" : ""}`}
              required
              value={input.pasangan || ""}
              onChange={(e) => setInput({ ...input, pasangan: e.target.value })}
            >
              <option value="">Tidak Tertanggung</option>
              <option value="true">Tertanggung</option>
            </select>
          </div>
          {getValidationError("pasangan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("pasangan")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field anak < 2 th --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">{`Anak < 2 th`}</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="tanggungan_invant"
              className={`input-bordered input w-full pl-10 ${getValidationError("tanggungan_invant") ? "input-error" : ""}`}
              value={
                input.tanggungan_invant
                  ? input.tanggungan_invant.toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = /^(0|[1-9]\d*)$/.test(rawValue);
                if (numericValue || rawValue === "") {
                  setInput({ ...input, tanggungan_invant: rawValue });
                }
              }}
              required
            />
          </div>
          {getValidationError("tanggungan_invant") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tanggungan_invant")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field anak > 2 th --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">{`Anak > 2 th`}</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="tanggungan"
              className={`input-bordered input w-full pl-10 ${getValidationError("tanggungan") ? "input-error" : ""}`}
              value={
                input.tanggungan ? input.tanggungan.toLocaleString("id-ID") : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = /^(0|[1-9]\d*)$/.test(rawValue);
                if (numericValue || rawValue === "") {
                  setInput({ ...input, tanggungan: rawValue });
                }
              }}
              required
            />
          </div>
          {getValidationError("tanggungan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tanggungan")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kantor Asal --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Kantor Asal</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <SearchableSelect
              onSelect={(val) => {
                setInput({ ...input, kantor_asal: val.kode_satker });
              }}
              options={kantor}
              placeholder="Cari atau pilih..."
              renderRow={(val, option, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => val(`${option.kantor}`, index)}
                    className="cursor-pointer border-b p-2 last:border-0 hover:bg-base-300"
                  >
                    {option.kantor}
                  </div>
                );
              }}
            />
          </div>
          {getValidationError("kantor_asal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kantor_asal")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Kantor Tujuan --- */}
        <div className="form-control col-span-2 md:col-span-1">
          <label className="label">
            <span className="label-text font-semibold">Kantor Tujuan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <SearchableSelect
              onSelect={(val) => {
                setInput({ ...input, kantor_tujuan: val.kode_satker });
              }}
              options={kantor}
              placeholder="Cari atau pilih..."
              renderRow={(val, option, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => val(`${option.kantor}`, index)}
                    className="cursor-pointer border-b p-2 last:border-0 hover:bg-base-300"
                  >
                    {option.kantor}
                  </div>
                );
              }}
            />
          </div>
          {getValidationError("kantor_tujuan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("kantor_tujuan")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
      {data && (
        <div className="relative mt-6 p-4 before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:rounded-lg before:bg-base-content/50 before:content-['']">
          {data.map((item) => (
            <div key={item.jenis} className="flex justify-between">
              <p className="text-sm font-semibold">
                {snackToTitleCase(item.jenis)}
              </p>
              <p className="text-lg font-bold">
                {item.total.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>
          ))}
          <div className="relative mt-4 flex justify-between before:absolute before:-top-2 before:left-0 before:h-1 before:w-full before:rounded-lg before:bg-neutral/80 before:content-['']">
            <p className="text-sm font-semibold">Total</p>
            <p className="text-lg font-bold">
              {data
                .reduce((acc, item) => acc + item.total, 0)
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
            </p>
          </div>
        </div>
      )}
      <div className="relative mt-4 before:absolute before:-top-2 before:left-0 before:h-1 before:w-full before:rounded-lg before:bg-base-content/50 before:content-['']">
        <p className="text-sm text-error">
          * hitungan ini hanya bersifat estimasi dan dapat berbeda dengan
          hitungan pembayaran.
        </p>
        <p className="text-sm text-error">
          * Jika ada pertanyaan, silakan hubungi petugas terkait.
        </p>
      </div>
    </Form>
  );
}
