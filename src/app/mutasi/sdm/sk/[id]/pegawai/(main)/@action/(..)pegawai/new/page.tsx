"use client";
import { useEffect, useState, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = usePegawai();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    nip: string;
    nama: string;
    golongan: string;
    kantor_asal: string;
    kantor_tujuan: string;
  }>({
    nip: "",
    nama: "",
    golongan: "",
    kantor_asal: "",
    kantor_tujuan: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
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
        setError(error as Error);
        addNotification({
          title: `Referensi Golongan`,
          message: (error as Error).message,
        });
      }
    };
    const fetchKantor = async () => {
      try {
        const res = await fetch(
          "/api/Mutasi/Referensi/Kantor?sortField=kode_kota&sortOrder=asc"
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        setKantor(data.data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Referensi Kantor`,
          message: (error as Error).message,
        });
      }
    };

    fetchGolongan();
    fetchKantor();
  }, []);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          nip: data.nip,
          nama: data.nama,
          golongan: data.golongan,
          kantor_asal: data.kantor_asal,
          kantor_tujuan: data.kantor_tujuan,
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
        message: "berhasil dibuat",
        title: "Pegawai Mutasi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Pegawai Mutasi",
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
            Input Pegawai
          </legend>
          <label className="label text-base-content">NIP:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "nip") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="nip"
            required
            autoComplete="off"
            onChange={(e) => setData({ ...data, nip: e.target.value })}
            value={data.nip}
          />
          {validationErrors.find((e) => e.field === "nip") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "nip")?.message}
            </p>
          )}

          <label className="label text-base-content">Nama:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "nip") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="nama"
            required
            autoComplete="off"
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            value={data.nama}
          />
          {validationErrors.find((e) => e.field === "nama") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "nama")?.message}
            </p>
          )}

          <label className="label text-base-content">Golongan:</label>
          <select
            name="golongan"
            className={`select select-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "golongan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            required
            onChange={(e) => setData({ ...data, golongan: e.target.value })}
            value={data.golongan}
          >
            <option disabled={true} value="">Golongan</option>
            {golongan.map((item) => (
              <option key={item.kode} value={item.kode}>
                {item.kode} - {item.nama}
              </option>
            ))}
          </select>
          {validationErrors.find((e) => e.field === "golongan") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "golongan")?.message}
            </p>
          )}

          <label className="label text-base-content">Kantor Asal:</label>
          <select
            name="kantor_asal"
            className={`select select-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "kantor_asal") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            required
            onChange={(e) => setData({ ...data, kantor_asal: e.target.value })}
            value={data.kantor_asal}
          >
            <option disabled={true} value="">Kantor Asal</option>
            {kantor.map((item) => (
              <option key={item.kode_satker} value={item.kode_satker}>
                {item.kantor}
              </option>
            ))}
          </select>
          {validationErrors.find((e) => e.field === "kantor_asal") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "kantor_asal")?.message}
            </p>
          )}

          <label className="label text-base-content">Kantor Tujuan:</label>
          <select
            name="kantor_tujuan"
            className={`select select-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "kantor_tujuan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            required
            onChange={(e) =>
              setData({ ...data, kantor_tujuan: e.target.value })
            }
            value={data.kantor_tujuan}
          >
            <option disabled={true} value="">Kantor Tujuan</option>
            {kantor.map((item) => (
              <option key={item.kode_satker} value={item.kode_satker}>
                {item.kantor}
              </option>
            ))}
          </select>
          {validationErrors.find((e) => e.field === "kantor_tujuan") && (
            <p className="text-error label font-bold">
              {
                validationErrors.find((e) => e.field === "kantor_tujuan")
                  ?.message
              }
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
