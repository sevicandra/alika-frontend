"use client";
import { useContext, useEffect, useState, use } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { useRouter } from "next/navigation";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
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
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/SetTimeline`, {
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
      });
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
          data.Timeline.find((e: any) => e.ref_kode === "01")?.tanggal ?? ""
        );
        setTanggalVerifikasi(
          data.Timeline.find((e: any) => e.ref_kode === "02")?.tanggal ?? ""
        );
        setTanggalSpm(
          data.Timeline.find((e: any) => e.ref_kode === "03")?.tanggal ?? ""
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
    <>
      {loading && (
        <div className="text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <form onSubmit={submitForm}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content">
            Edit Timeline
          </legend>

          <label className="label text-base-content after:content-['*'] after:text-error">
            Timeline Sanggah:
          </label>
          <input
            type="date"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "timeline_sanggah") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="timeline_sanggah"
            value={tanggalSanggah}
            onChange={(e) => setTanggalSanggah(e.target.value)}
          />
          {validationErrors.find((e) => e.field === "timeline_sanggah") && (
            <p className="text-error label font-bold">
              {
                validationErrors.find((e) => e.field === "timeline_sanggah")
                  ?.message
              }
            </p>
          )}

          <label className="label text-base-content after:content-['*'] after:text-error">
            Timeline Verifikasi:
          </label>
          <input
            type="date"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "timeline_verifikasi") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="timeline_verifikasi"
            value={tanggalVerifikasi}
            onChange={(e) => setTanggalVerifikasi(e.target.value)}
          />
          {validationErrors.find((e) => e.field === "timeline_verifikasi") && (
            <p className="text-error label font-bold">
              {
                validationErrors.find((e) => e.field === "timeline_verifikasi")
                  ?.message
              }
            </p>
          )}

          <label className="label text-base-content after:content-['*'] after:text-error">
            Timeline SPM:
          </label>
          <input
            type="date"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "timeline_spm") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="timeline_spm"
            value={tanggalSpm}
            onChange={(e) => setTanggalSpm(e.target.value)}
          />
          {validationErrors.find((e) => e.field === "timeline_spm") && (
            <p className="text-error label font-bold">
              {
                validationErrors.find((e) => e.field === "timeline_spm")
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
