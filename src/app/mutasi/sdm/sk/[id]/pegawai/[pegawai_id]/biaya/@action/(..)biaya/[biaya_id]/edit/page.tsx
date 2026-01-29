"use client";
import { useEffect, useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; biaya_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, biaya_id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { setRefresh } = useTable();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya/${biaya_id}`,
        );
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setInput(data);
      } catch (error) {
        addNotification({
          title: "Fetch Biaya Mutasi",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [addNotification, biaya_id, id, pegawai_id]);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      setValidationErrors({});
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
        title: "Ubah Biaya Mutasi",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Ubah Biaya Mutasi",
        variant: "error",
      });
    }
  }
  if (error) throw error;
  return (
    <Form
      title="Ubah Biaya"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
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
              onChange={(e) => setInput({ ...input, jenis: e.target.value })}
              value={input.jenis || ""}
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
          </div>
          {getValidationError("jenis") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("jenis")}
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
              value={input.sub_jenis || ""}
              onChange={(e) =>
                setInput({ ...input, sub_jenis: e.target.value })
              }
            />
          </div>
          {getValidationError("sub_jenis") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("sub_jenis")}
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
              value={input.keterangan || ""}
              onChange={(e) =>
                setInput({ ...input, keterangan: e.target.value })
              }
            />
          </div>
          {getValidationError("keterangan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("keterangan")}
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
              value={input.volume || ""}
              onChange={(e) => {
                const value = e.target.value.replace(",", ".");
                if (/^\d*\.?\d*$/.test(value)) {
                  setInput({ ...input, volume: Number(value) });
                }
              }}
            />
          </div>
          {getValidationError("volume") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("volume")}
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
              value={
                input.harga_satuan
                  ? input.harga_satuan.toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                const numericValue = Number(rawValue);
                if (!isNaN(numericValue)) {
                  setInput({ ...input, harga_satuan: numericValue });
                }
              }}
            />
          </div>
          {getValidationError("harga_satuan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("harga_satuan")}
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
              value={input.urutan || "" || ""}
              onChange={(e) =>
                setInput({ ...input, urutan: Number(e.target.value) })
              }
            />
          </div>
          {getValidationError("urutan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("urutan")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
