"use client";
import { useContext, useEffect, useState, use } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { useBiaya } from "@/context/mutasi/sdm";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useBiaya();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const [data, setData] = useState<{
    jenis: string;
    sub_jenis: string;
    keterangan: string;
    volume: string;
    harga_satuan: number;
    urutan: string;
  }>({
    jenis: "",
    sub_jenis: "",
    keterangan: "",
    volume: "",
    harga_satuan: 0,
    urutan: "",
  });

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya`,
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
            jenis: data.jenis,
            sub_jenis: data.sub_jenis,
            keterangan: data.keterangan,
            volume: parseFloat(data.volume),
            harga_satuan: data.harga_satuan,
            urutan: data.urutan,
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
        title: "Biaya Mutasi",
        message: "Biaya Mutasi berhasil dibuat",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Biaya Mutasi",
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
            Input Biaya
          </legend>

          <label className="label text-base-content">Jenis:</label>
          <select
            name="jenis"
            className={`select select-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "jenis") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            required
            value={data.jenis}
            onChange={(e) => setData({ ...data, jenis: e.target.value })}
          >
            <option disabled={true} value={""}>
              Jenis Biaya
            </option>
            <option value="BIAYA_ANGKUT_ORANG">BIAYA ANGKUT ORANG</option>
            <option value="BIAYA_ANGKUT_BARANG">BIAYA ANGKUT BARANG</option>
            <option value="UANG_HARIAN">UANG HARIAN</option>
            <option value="BIAYA_ANGKUT_ORANG_ART">
              BIAYA ANGKUT ORANG ART
            </option>
            <option value="BIAYA_ANGKUT_BARANG_ART">
              BIAYA ANGKUT BARANG ART
            </option>
            <option value="UANG_HARIAN_ART">UANG HARIAN ART</option>
          </select>
          {validationErrors.find((e) => e.field === "jenis") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "jenis")?.message}
            </p>
          )}

          <label className="label text-base-content">Sub Jenis:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "sub_jenis") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="sub_jenis"
            required
            autoComplete="off"
            value={data.sub_jenis}
            onChange={(e) => setData({ ...data, sub_jenis: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "sub_jenis") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "sub_jenis")?.message}
            </p>
          )}

          <label className="label text-base-content">Keterangan:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "keterangan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="keterangan"
            autoComplete="off"
            value={data.keterangan}
            onChange={(e) => setData({ ...data, keterangan: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "keterangan") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "keterangan")?.message}
            </p>
          )}

          <label className="label text-base-content">Volume:</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "volume") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Masukkan volume"
            name="volume"
            autoComplete="off"
            required
            value={data.volume}
            onChange={(e) => {
              const value = e.target.value.replace(",", ".");
              if (/^\d*\.?\d*$/.test(value)) {
                setData({ ...data, volume: value });
              }
            }}
          />
          {validationErrors.find((e) => e.field === "volume") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "volume")?.message}
            </p>
          )}

          <label className="label text-base-content">Harga Satuan:</label>
          <input
            type="text"
            inputMode="numeric"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "harga_satuan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Masukkan harga satuan"
            name="harga_satuan"
            autoComplete="off"
            required
            value={data.harga_satuan.toLocaleString("id-ID")}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^\d]/g, "");
              const numericValue = Number(rawValue);
              if (!isNaN(numericValue)) {
                setData({ ...data, harga_satuan: numericValue });
              }
            }}
          />
          {validationErrors.find((e) => e.field === "harga_satuan") && (
            <p className="text-error label font-bold">
              {
                validationErrors.find((e) => e.field === "harga_satuan")
                  ?.message
              }
            </p>
          )}

          <label className="label text-base-content">Urutan:</label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "urutan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            pattern="[0-9]*"
            placeholder="Type here"
            name="urutan"
            autoComplete="off"
            required
            value={data.urutan}
            onChange={(e) => setData({ ...data, urutan: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "urutan") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "urutan")?.message}
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
