"use client";
import { useEffect, useState, use } from "react";
import { usePegawaiDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({ params }: { params: Promise<{ id: string; pegawai_id: string }> }) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [refTermin, setRefTermin] = useState<
    {
      kode: string;
      nama: string;
    }[]
  >([]);
  const { data: pegawai, setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [data, setData] = useState<{
    tahun: string;
    ref_termin: string;
    nominal: number;
  }>({
    ref_termin: "",
    tahun: "",
    nominal: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Mutasi/Referensi/Termin`);
        const { data } = await res.json();
        setRefTermin(data);
      } catch (error) {
        addNotification({
          title: "Referensi Termin",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          ref_termin: data.ref_termin,
          tahun: data.tahun,
          nominal: data.nominal,
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
        title: "Tambah Termin",
        message: "berhasil menambahkan termin",
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
  if (error) throw error;
  return (
    <form onSubmit={submitForm} noValidate>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
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
                  value={data.ref_termin}
                  onChange={(e) => setData({ ...data, ref_termin: e.target.value })}
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
                    {getValidationError("ref_termin")?.message}
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
                  value={data.tahun}
                  onChange={(e) => {
                    setData({ ...data, tahun: e.target.value });
                  }}
                />
              </div>
              {getValidationError("tahun") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} /> {getValidationError("tahun")?.message}
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
                    {pegawai?.MonitoringTagihan.sisa_tagihan.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
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
                  value={data.nominal.toLocaleString("id-ID")}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const numericValue = Number(rawValue);
                    if (!isNaN(numericValue)) {
                      setData({ ...data, nominal: numericValue });
                    }
                  }}
                />
              </div>
              {getValidationError("nominal") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} /> {getValidationError("nominal")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Tambah Termin
          </button>
        </div>
      </div>
    </form>
  );
}
