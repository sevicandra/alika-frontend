"use client";
import { useEffect, useState, use } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";

import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";
import { SearchableSelect } from "@/component/Molecules/InputForm";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();

  const { id, pegawai_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [golongan, setGolongan] = useState<
    {
      kode: string;
      nama: string;
    }[]
  >([]);
  const [kantor, setKantor] = useState<
    {
      kode_satker: string;
      kantor: string;
    }[]
  >([]);
  useEffect(() => {
    const fetchGolongan = async () => {
      try {
        const res = await fetch("/api/Mutasi/Referensi/Golongan");
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        setGolongan(data.data);
      } catch (error) {
        addNotification({
          title: `Golongan`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      }
    };
    const fetchKantor = async () => {
      try {
        const res = await fetch(
          "/api/Mutasi/Referensi/Kantor?sortField=kode_kota&sortOrder=asc",
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        setKantor(data.data);
      } catch (error) {
        addNotification({
          title: `Kantor`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      }
    };

    fetchGolongan();
    fetchKantor();
  }, [addNotification]);
  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}`,
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

    fetchPegawai();
  }, [id, pegawai_id, setInput]);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}`,
        {
          headers: {
            "Content-Type": "application/json",
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

        throw new Error(message);
      }
      addNotification({
        message: "Berhasil diubah",
        title: "Data pegawai",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Data pegawai",
        variant: "error",
      });
    }
  }
  if (error) throw error;
  return (
    <Form
      title="Ubah Pegawai"
      onCancel={() => router.back()}
      submitForm={(e) => submitForm(e)}
      loading={loading}
      variant="positive"
      confirmText="Tambah Pegawai"
      cancelText="Kembali"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        {/* --- Field Nama --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nama"
              className={`input-bordered input w-full pl-10 ${getValidationError("nama") ? "input-error" : ""}`}
              required
              value={input.nama || ""}
              onChange={(e) => setInput({ ...input, nama: e.target.value })}
            />
          </div>
          {getValidationError("nama") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nama")?.message}
              </span>
            </label>
          )}
        </div>

        {/* --- Field NIP --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">NIP</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nip"
              className={`input-bordered input w-full pl-10 ${getValidationError("nip") ? "input-error" : ""}`}
              required
              value={input.nip || ""}
              onChange={(e) => setInput({ ...input, nip: e.target.value })}
            />
          </div>
          {getValidationError("nip") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nip")?.message}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Golongan --- */}
        <div className="form-control">
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
              value={input.golongan}
              onChange={(e) => setInput({ ...input, golongan: e.target.value })}
            >
              <option disabled={true} value="">
                Golongan
              </option>
              {golongan.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.kode} - {item.nama}
                </option>
              ))}
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
    </Form>
  );
}
