"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({ params }: { params: Promise<{ id: string; pegawai_id: string }> }) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);
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
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

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
                  <option value="BIAYA_ANGKUT_BARANG">BIAYA ANGKUT BARANG</option>
                  <option value="UANG_HARIAN">UANG HARIAN</option>
                  <option value="BIAYA_ANGKUT_ORANG_ART">BIAYA ANGKUT ORANG ART</option>
                  <option value="BIAYA_ANGKUT_BARANG_ART">BIAYA ANGKUT BARANG ART</option>
                  <option value="UANG_HARIAN_ART">UANG HARIAN ART</option>
                </select>
              </div>
              {getValidationError("jenis") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} /> {getValidationError("jenis")?.message}
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
                  onChange={(e) => setData({ ...data, sub_jenis: e.target.value })}
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
                  onChange={(e) => setData({ ...data, keterangan: e.target.value })}
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
                    <Icon icon="CircleAlert" height={16} /> {getValidationError("volume")?.message}
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
                    <Icon icon="CircleAlert" height={16} /> {getValidationError("urutan")?.message}
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
            <Icon icon="FileText" height={16} /> Tambah Biaya
          </button>
        </div>
      </div>
    </form>
  );
}
