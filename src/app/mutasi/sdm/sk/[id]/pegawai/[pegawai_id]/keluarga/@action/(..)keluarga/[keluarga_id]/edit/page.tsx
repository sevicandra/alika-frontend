"use client";
import { useEffect, useState, use } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Form from "@/component/Organisms/Form";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; keluarga_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, keluarga_id } = use(params);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [hubungan, setHubungan] = useState<
    {
      kode: string;
      nama: string;
      jenis: string;
    }[]
  >([]);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  useEffect(() => {
    const fetchRef = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Mutasi/Referensi/HubunganKeluarga");
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setHubungan(data);
      } catch (error) {
        addNotification({
          title: `Referensi Hubungan Keluarga`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRef();
  }, [addNotification]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga/${keluarga_id}`,
          {
            method: "GET",
          },
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
          title: `Data Keluarga`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, id, keluarga_id, pegawai_id, setInput]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) {
      return;
    }    
    try {
      setLoading(true);
      setValidationErrors({});
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga/${keluarga_id}`,
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
        title: "Ubah Data Keluarga",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Ubah Data Keluarga",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Ubah Keluarga"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* --- Field Nama --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nama</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nama"
              className={`input-bordered input w-full pl-10 ${getValidationError("nama") ? "input-error" : ""}`}
              value={input.nama || ""}
              onChange={(e) => setInput({ ...input, nama: e.target.value })}
            />
          </div>
          {getValidationError("nama") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nama")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field NIK --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">NIK</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="nik"
              className={`input-bordered input w-full pl-10 ${getValidationError("nik") ? "input-error" : ""}`}
              value={input.nik || ""}
              onChange={(e) => setInput({ ...input, nik: e.target.value })}
            />
          </div>
          {getValidationError("nik") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("nik")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Hubungan --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Hubungan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="hubungan"
              className={`select-bordered select w-full pl-10 ${getValidationError("hubungan") ? "select-error" : ""}`}
              onChange={(e) => setInput({ ...input, hubungan: e.target.value })}
              value={input.hubungan || ""}
            >
              <option disabled={true} value="">
                Hubungan
              </option>
              {hubungan.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("hubungan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("hubungan")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Status --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Status Tanggungan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="status"
              className={`select-bordered select w-full pl-10 ${getValidationError("status") ? "select-error" : ""}`}
              onChange={(e) => setInput({ ...input, status: e.target.value })}
              value={input.status || ""}
            >
              <option disabled={true} value={""}>
                Status Tanggungan
              </option>
              <option value="TIDAK_TERTANGGUNG">TIDAK TERTANGGUNG</option>
              <option value="TERTANGGUNG">TERTANGGUNG</option>
            </select>
          </div>
          {getValidationError("status") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("status")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Tanggal Lahir --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Tanggal Lahir</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="CalendarDays" height={20} />
            </span>
            <input
              name="tanggal_lahir"
              type="date"
              className={`input-bordered input w-full pl-10 ${getValidationError("tanggal_lahir") ? "input-error" : ""}`}
              value={input.tanggal_lahir || ""}
              onChange={(e) =>
                setInput({ ...input, tanggal_lahir: e.target.value })
              }
            />
          </div>
          {getValidationError("tanggal_lahir") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("tanggal_lahir")}
              </span>
            </label>
          )}
        </div>

        {/* --- Field Pekerjaan --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Pekerjaan</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="FileText" height={20} />
            </span>
            <input
              type="text"
              name="pekerjaan"
              className={`input-bordered input w-full pl-10 ${getValidationError("pekerjaan") ? "input-error" : ""}`}
              value={input.pekerjaan || ""}
              onChange={(e) =>
                setInput({ ...input, pekerjaan: e.target.value })
              }
            />
          </div>
          {getValidationError("pekerjaan") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("pekerjaan")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
