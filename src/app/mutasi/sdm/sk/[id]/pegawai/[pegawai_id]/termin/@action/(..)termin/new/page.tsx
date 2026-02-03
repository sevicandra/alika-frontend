"use client";
import { useEffect, useState, use } from "react";
import { usePegawaiDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);
  const [refTermin, setRefTermin] = useState<
    {
      kode: string;
      nama: string;
    }[]
  >([]);
  const { data: pegawai, setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Mutasi/Referensi/Termin`);
        const { data, error } = await res.json();
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
        setRefTermin(data);
      } catch (error) {
        addNotification({
          title: "Referensi Termin",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification, setValidationErrors]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify(input),
        },
      );
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
        title: "Tambah Termin",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
      setRefreshPegawai();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Tambah Termin",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tambah Termin"
      onCancel={() => router.back()}
      submitForm={(e) => submitForm(e)}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
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
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="ref_termin"
              className={`select-bordered select w-full pl-10 ${getValidationError("ref_termin") ? "select-error" : ""}`}
              required
              value={input.ref_termin || ""}
              onChange={(e) =>
                setInput({ ...input, ref_termin: e.target.value })
              }
            >
              <option disabled={true} value={""}>
                Pilih Jenis Termin
              </option>
              {refTermin.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("ref_termin") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("ref_termin")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Tahun Anggaran --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Tahun Anggaran</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              name="tahun"
              className={`input-bordered input w-full pl-10 ${getValidationError("tahun") ? "input-error" : ""}`}
              required
              value={input.tahun || ""}
              onChange={(e) => {
                setInput({ ...input, tahun: e.target.value });
              }}
            />
          </div>
          {getValidationError("tahun") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tahun")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Nominal --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Nominal{" "}
              <p className="text-info">
                (Sisa Tagihan:{" "}
                {pegawai?.MonitoringTagihan.sisa_tagihan.toLocaleString(
                  "id-ID",
                  {
                    style: "currency",
                    currency: "IDR",
                  },
                )}
                )
              </p>
            </span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*[.,]?[0-9]*"
              name="nominal"
              className={`input-bordered input w-full pl-10 ${getValidationError("nominal") ? "input-error" : ""}`}
              required
              value={input.nominal ? input.nominal.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = Number(rawValue);
                if (!isNaN(numericValue)) {
                  setInput({ ...input, nominal: numericValue });
                }
              }}
            />
          </div>
          {getValidationError("nominal") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nominal")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
