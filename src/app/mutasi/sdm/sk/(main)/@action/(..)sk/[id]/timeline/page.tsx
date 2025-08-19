"use client";
import { useEffect, useState, use } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const { setRefresh } = useSk();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const [tanggalSanggah, setTanggalSanggah] = useState("");
  const [tanggalVerifikasi, setTanggalVerifikasi] = useState("");
  const [tanggalSpm, setTanggalSpm] = useState("");

  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/SetTimeline`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            timeline_sanggah: tanggalSanggah,
            timeline_verifikasi: tanggalVerifikasi,
            timeline_spm: tanggalSpm,
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
        message: "Berhasil di ubah",
        title: "Timeline",
      });
      setRefresh();
      router.back();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Timeline",
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setTanggalSanggah(
          data.Timeline.find((e: any) => e.ref_kode === "01")?.tanggal ?? "",
        );
        setTanggalVerifikasi(
          data.Timeline.find((e: any) => e.ref_kode === "02")?.tanggal ?? "",
        );
        setTanggalSpm(
          data.Timeline.find((e: any) => e.ref_kode === "03")?.tanggal ?? "",
        );
      } catch (error) {
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (error) throw error;
  return (
    <form onSubmit={submitForm}>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Timeline Sanggah</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="CalendarDays" height={20} />
              </span>
              <input
                name="timeline_sanggah"
                type="date"
                className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                value={tanggalSanggah}
                onChange={(e) => setTanggalSanggah(e.target.value)}
              />
            </div>
            {getValidationError("tanggal") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("tanggal")?.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Timeline Verifikasi
              </span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="CalendarDays" height={20} />
              </span>
              <input
                type="date"
                className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                name="timeline_verifikasi"
                value={tanggalVerifikasi}
                onChange={(e) => setTanggalVerifikasi(e.target.value)}
              />
            </div>
            {getValidationError("tanggal") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("tanggal")?.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Timeline Verifikasi
              </span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                <Icon icon="CalendarDays" height={20} />
              </span>
              <input
                type="date"
                className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                name="timeline_spm"
                value={tanggalSpm}
                onChange={(e) => setTanggalSpm(e.target.value)}
              />
            </div>
            {getValidationError("tanggal") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("tanggal")?.message}
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
      <div className="bg-base-100 shadow-xl">
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Buat Timeline
          </button>
        </div>
      </div>
    </form>
  );
}
