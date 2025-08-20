"use client";
import { useEffect, useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useBiaya } from "@/context/mutasi/sdm";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; biaya_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, biaya_id } = use(params);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [error, setError] = useState<Error | null>(null);

  const { addNotification } = useNotification();
  const { setRefresh } = useBiaya();
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya/${biaya_id}`,
        );
        const { data } = await res.json();
        setData({
          jenis: data.jenis,
          sub_jenis: data.sub_jenis,
          keterangan: data.keterangan,
          volume: data.volume,
          harga_satuan: data.harga_satuan,
          urutan: data.urutan,
        });
      } catch (error) {
        addNotification({
          title: "Biaya Mutasi",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya/${biaya_id}`,
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
            jenis: data.jenis,
            sub_jenis: data.sub_jenis,
            keterangan: data.keterangan,
            volume: parseFloat(data.volume),
            harga_satuan: data.harga_satuan,
            urutan: data.urutan,
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
        title: "Biaya Mutasi",
        message: "Biaya Mutasi berhasil diubah",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Biaya Mutasi",
        variant: "error",
      });
    }
  }
  if (error) throw error;
  return (
    // <>
    //   {loading && (
    //     <div className="absolute z-10 flex h-full w-full text-primary-600">
    //       <Loading />
    //     </div>
    //   )}
    //   <form onSubmit={submitForm}>
    //     <fieldset className="fieldset px-2 py-4">
    //       <label className="label text-base-content">Jenis:</label>
    //       <select
    //         name="jenis"
    //         className={`select w-full bg-base-300 select-sm focus:outline-none ${validationErrors.find((e) => e.field === "jenis") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         required
    //         value={data.jenis}
    //         onChange={(e) => setData({ ...data, jenis: e.target.value })}
    //       >
    //         <option disabled={true} value={""}>
    //           Jenis Biaya
    //         </option>
    //         <option value="BIAYA_ANGKUT_ORANG">BIAYA ANGKUT ORANG</option>
    //         <option value="BIAYA_ANGKUT_BARANG">BIAYA ANGKUT BARANG</option>
    //         <option value="UANG_HARIAN">UANG HARIAN</option>
    //         <option value="BIAYA_ANGKUT_ORANG_ART">
    //           BIAYA ANGKUT ORANG ART
    //         </option>
    //         <option value="BIAYA_ANGKUT_BARANG_ART">
    //           BIAYA ANGKUT BARANG ART
    //         </option>
    //         <option value="UANG_HARIAN_ART">UANG HARIAN ART</option>
    //       </select>
    //       {validationErrors.find((e) => e.field === "jenis") && (
    //         <p className="label font-bold text-error">
    //           {validationErrors.find((e) => e.field === "jenis")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Sub Jenis:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "sub_jenis") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="sub_jenis"
    //         required
    //         autoComplete="off"
    //         value={data.sub_jenis}
    //         onChange={(e) => setData({ ...data, sub_jenis: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "sub_jenis") && (
    //         <p className="label font-bold text-error">
    //           {validationErrors.find((e) => e.field === "sub_jenis")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Keterangan:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "keterangan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="keterangan"
    //         autoComplete="off"
    //         value={data.keterangan}
    //         onChange={(e) => setData({ ...data, keterangan: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "keterangan") && (
    //         <p className="label font-bold text-error">
    //           {validationErrors.find((e) => e.field === "keterangan")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Volume:</label>
    //       <input
    //         type="text"
    //         inputMode="decimal"
    //         pattern="[0-9]*[.,]?[0-9]*"
    //         className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "volume") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Masukkan volume"
    //         name="volume"
    //         autoComplete="off"
    //         required
    //         value={data.volume}
    //         onChange={(e) => {
    //           const value = e.target.value.replace(",", ".");
    //           if (/^\d*\.?\d*$/.test(value)) {
    //             setData({ ...data, volume: value });
    //           }
    //         }}
    //       />
    //       {validationErrors.find((e) => e.field === "volume") && (
    //         <p className="label font-bold text-error">
    //           {validationErrors.find((e) => e.field === "volume")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Harga Satuan:</label>
    //       <input
    //         type="text"
    //         inputMode="numeric"
    //         className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "harga_satuan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Masukkan harga satuan"
    //         name="harga_satuan"
    //         autoComplete="off"
    //         required
    //         value={data.harga_satuan.toLocaleString("id-ID")}
    //         onChange={(e) => {
    //           const rawValue = e.target.value.replace(/[^\d]/g, "");
    //           const numericValue = Number(rawValue);
    //           if (!isNaN(numericValue)) {
    //             setData({ ...data, harga_satuan: numericValue });
    //           }
    //         }}
    //       />
    //       {validationErrors.find((e) => e.field === "harga_satuan") && (
    //         <p className="label font-bold text-error">
    //           {
    //             validationErrors.find((e) => e.field === "harga_satuan")
    //               ?.message
    //           }
    //         </p>
    //       )}

    //       <label className="label text-base-content">Urutan:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm w-full bg-base-300 focus:outline-none ${validationErrors.find((e) => e.field === "urutan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         pattern="[0-9]*"
    //         placeholder="Type here"
    //         name="urutan"
    //         autoComplete="off"
    //         required
    //         value={data.urutan}
    //         onChange={(e) => setData({ ...data, urutan: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "urutan") && (
    //         <p className="label font-bold text-error">
    //           {validationErrors.find((e) => e.field === "urutan")?.message}
    //         </p>
    //       )}

    //       <button type="submit" className="btn mt-4 btn-sm btn-accent">
    //         Submit
    //       </button>
    //     </fieldset>
    //   </form>
    // </>
    <form onSubmit={submitForm} noValidate>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            {/* --- Field Jenis --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Jenis</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="jenis"
                  className={`select-bordered select w-full pl-10 ${getValidationError("jenis") ? "select-error" : ""}`}
                  required
                  onChange={(e) => setData({ ...data, jenis: e.target.value })}
                  value={data.jenis}
                >
                  <option disabled={true} value={""}>
                    Jenis Biaya
                  </option>
                  <option value="BIAYA_ANGKUT_ORANG">BIAYA ANGKUT ORANG</option>
                  <option value="BIAYA_ANGKUT_BARANG">
                    BIAYA ANGKUT BARANG
                  </option>
                  <option value="UANG_HARIAN">UANG HARIAN</option>
                  <option value="BIAYA_ANGKUT_ORANG_ART">
                    BIAYA ANGKUT ORANG ART
                  </option>
                  <option value="BIAYA_ANGKUT_BARANG_ART">
                    BIAYA ANGKUT BARANG ART
                  </option>
                  <option value="UANG_HARIAN_ART">UANG HARIAN ART</option>
                </select>
              </div>
              {getValidationError("jenis") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("jenis")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Sub Jenis --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sub Jenis</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="sub_jenis"
                  className={`input-bordered input w-full pl-10 ${getValidationError("sub_jenis") ? "input-error" : ""}`}
                  required
                  value={data.sub_jenis}
                  onChange={(e) =>
                    setData({ ...data, sub_jenis: e.target.value })
                  }
                />
              </div>
              {getValidationError("sub_jenis") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("sub_jenis")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Keterangan --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Keterangan</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="keterangan"
                  className={`input-bordered input w-full pl-10 ${getValidationError("keterangan") ? "input-error" : ""}`}
                  required
                  value={data.keterangan}
                  onChange={(e) =>
                    setData({ ...data, keterangan: e.target.value })
                  }
                />
              </div>
              {getValidationError("keterangan") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("keterangan")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Volume --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Volume</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  name="volume"
                  className={`input-bordered input w-full pl-10 ${getValidationError("volume") ? "input-error" : ""}`}
                  required
                  value={data.volume}
                  onChange={(e) => {
                    const value = e.target.value.replace(",", ".");
                    if (/^\d*\.?\d*$/.test(value)) {
                      setData({ ...data, volume: value });
                    }
                  }}
                />
              </div>
              {getValidationError("volume") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("volume")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Harga Satuan --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Harga Satuan</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*[.,]?[0-9]*"
                  name="harga_satuan"
                  className={`input-bordered input w-full pl-10 ${getValidationError("harga_satuan") ? "input-error" : ""}`}
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
              </div>
              {getValidationError("harga_satuan") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("harga_satuan")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Urutan --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Urutan</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  name="urutan"
                  className={`input-bordered input w-full pl-10 ${getValidationError("urutan") ? "input-error" : ""}`}
                  required
                  value={data.urutan || ""}
                  onChange={(e) => setData({ ...data, urutan: e.target.value })}
                />
              </div>
              {getValidationError("urutan") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("urutan")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Ubah Biaya
          </button>
        </div>
      </div>
    </form>
  );
}
