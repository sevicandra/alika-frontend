"use client";
import { useContext, useState, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = usePegawai();
  const [data, setData] = useState<{
    percentage: string;
    maximum: number;
    tahun_uang_muka: string;
    tahun_lunas: string;
  }>({
    percentage: "",
    maximum: 0,
    tahun_uang_muka: "",
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
            type: "UANG_MUKA",
            percentage: parseFloat(data.percentage),
            maximum: data.maximum,
            tahun_uang_muka: data.tahun_uang_muka,
            tahun_lunas: data.tahun_lunas,
          }),
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
    }
  }

  return (
    <form onSubmit={submitForm}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-content">
          Input Mekanisme Uang Muka
        </legend>

        <label className="label text-base-content after:text-error after:content-['*']">
          Persentase:
        </label>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "percentage") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
          placeholder="Masukkan percentage"
          name="percentage"
          autoComplete="off"
          required
          value={data.percentage}
          onChange={(e) => {
            const value = e.target.value.replace(",", ".");
            if (/^\d*\.?\d*$/.test(value)) {
              setData({ ...data, percentage: value });
            }
          }}
        />
        {validationErrors.find((e) => e.field === "percentage") && (
          <p className="label font-bold text-error">
            {validationErrors.find((e) => e.field === "percentage")?.message}
          </p>
        )}

        <label className="label text-base-content">Maksimal:</label>
        <input
          type="text"
          inputMode="numeric"
          className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "maximum") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
          placeholder="Masukkan harga satuan"
          name="maximum"
          autoComplete="off"
          value={data.maximum.toLocaleString("id-ID")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");
            const numericValue = Number(rawValue);
            if (!isNaN(numericValue)) {
              setData({ ...data, maximum: numericValue });
            }
          }}
        />
        {validationErrors.find((e) => e.field === "maximum") && (
          <p className="label font-bold text-error">
            {validationErrors.find((e) => e.field === "maximum")?.message}
          </p>
        )}

        <label className="label text-base-content after:text-error after:content-['*']">
          Tahun Uang Muka:
        </label>
        <input
          type="text"
          inputMode="numeric"
          className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "tahun_uang_muka") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
          placeholder="Masukkan harga satuan"
          name="tahun_uang_muka"
          autoComplete="off"
          required
          value={data.tahun_uang_muka}
          onChange={(e) => {
            setData({ ...data, tahun_uang_muka: e.target.value });
          }}
        />
        {validationErrors.find((e) => e.field === "tahun_uang_muka") && (
          <p className="label font-bold text-error">
            {
              validationErrors.find((e) => e.field === "tahun_uang_muka")
                ?.message
            }
          </p>
        )}

        <label className="label text-base-content after:text-error after:content-['*']">
          Tahun Pelunasan:
        </label>
        <input
          type="text"
          inputMode="numeric"
          className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "tahun_lunas") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
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
          <p className="label font-bold text-error">
            {validationErrors.find((e) => e.field === "tahun_lunas")?.message}
          </p>
        )}

        <button type="submit" className="btn mt-4 btn-sm btn-accent">
          Submit
        </button>
      </fieldset>
    </form>
  );
}
