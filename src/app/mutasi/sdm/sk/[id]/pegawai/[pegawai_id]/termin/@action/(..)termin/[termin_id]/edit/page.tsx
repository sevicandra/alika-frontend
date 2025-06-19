"use client";
import { useContext, useEffect, useState, use } from "react";
import { useTermin, usePegawaiDetail } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

const dokumenOptions = [
  { kode: "KP4", nama: "KP4" },
  { kode: "RINCIAN BIAYA", nama: "RINCIAN BIAYA" },
  { kode: "SPD", nama: "SPD" },
];

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; termin_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, termin_id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useTermin();
  const { setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const [data, setData] = useState<{
    tahun: string;
    ref_termin: string;
    nominal: number;
  }>({
    ref_termin: "",
    tahun: "",
    nominal: 0,
  });
  const [refTermin, setRefTermin] = useState<
    {
      kode: string;
      nama: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin/${termin_id}`
        );

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Data Termin",
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin/${termin_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "PATCH",
          body: JSON.stringify({
            ref_termin: data.ref_termin,
            tahun: data.tahun,
            nominal: data.nominal,
          }),
        }
      );
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message);
      }
      addNotification({
        title: "Ubah Termin",
        message: "berhasil di ubah",
      });
      router.back();
      setRefresh();
      setRefreshPegawai();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Ubah Termin",
      });
    } finally {
      setLoading(false);
    }
  }

  if (error) throw error;

  return (
    <>
      {loading && (
        <div className="text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <form onSubmit={submitForm}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content">
            Input Termin
          </legend>

          <label className="label text-base-content">Nama:</label>
          <select
            name="ref_termin"
            className={`select select-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "ref_termin") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
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
          {validationErrors.find((e) => e.field === "ref_termin") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "ref_termin")?.message}
            </p>
          )}

          <label className="label text-base-content">Tahun Anggaran:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "tahun") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="tahun"
            required
            autoComplete="off"
            value={data.tahun}
            onChange={(e) => setData({ ...data, tahun: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "tahun") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "tahun")?.message}
            </p>
          )}

          <label className="label text-base-content">Nominal :</label>
          <input
            type="text"
            inputMode="numeric"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "nominal") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Masukkan harga satuan"
            name="nominal"
            autoComplete="off"
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

          {validationErrors.find((e) => e.field === "nominal") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "nominal")?.message}
            </p>
          )}

          <button type="submit" className="btn btn-sm mt-4 btn-accent">
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
}
