"use client";
import { useState, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = usePegawai();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    tahun_lunas: string;
  }>({
    tahun_lunas: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/ProcessTermin`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            type: "LUNAS",
            tahun_lunas: data.tahun_lunas,
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
        message: "Berhasil di proses",
        title: "Termin",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Termin",
      });
    } finally {
      setLoading(false);
    }
  }

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
            Input Mekanisme Sekaligus
          </legend>

          <label className="label text-base-content after:content-['*'] after:text-error">
            Tahun Anggaran:
          </label>
          <input
            type="text"
            inputMode="numeric"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "tahun_lunas") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Masukkan harga satuan"
            name="tahun_lunas"
            autoComplete="off"
            required
            value={data.tahun_lunas}
            onChange={(e) => {
              setData({ ...data, tahun_lunas: e.target.value });
            }}
          />
          {validationErrors.find((e) => e.field === "tahun_lunas") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "tahun_lunas")?.message}
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
