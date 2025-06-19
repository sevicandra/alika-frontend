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
  const [data, setData] = useState<{
    nomor: string;
    uraian: string;
    tanggal: Date | null;
    tmt: Date | null;
    jenjang: string;
  }>({
    nomor: "",
    uraian: "",
    tanggal: null,
    tmt: null,
    jenjang: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  async function submitForm(formData: FormData) {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "PATCH",
        body: formData,
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
        title: "Surat Keputusan",
      });
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
      });
      setError(error as Error);
    } finally {
      setLoading(false);
      router.back();
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
        setData(data);
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
      <form action={submitForm}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content">
            Edit Surat Keputusan
          </legend>
          <label className="label text-base-content after:content-['*'] after:text-error">
            Nomor:
          </label>
          <input
            type="text"
            className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "nomor") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            name="nomor"
            value={data.nomor}
            onChange={(e) => setData({ ...data, nomor: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "nomor") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "nomor")?.message}
            </p>
          )}
          <label className="label text-base-content after:content-['*'] after:text-error">
            Uraian:
          </label>
          <textarea
            name="uraian"
            className={`textarea h-24 focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "uraian") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            value={data.uraian}
            onChange={(e) => setData({ ...data, uraian: e.target.value })}
          ></textarea>
          {validationErrors.find((e) => e.field === "uraian") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "uraian")?.message}
            </p>
          )}
          <label className="label text-base-content after:content-['*'] after:text-error">
            Tanggal:
          </label>
          <input
            name="tanggal"
            type="date"
            className={`input input-sm focus:outline-none w-full max-w-md  bg-base-300 ${validationErrors.find((e) => e.field === "tanggal") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            value={
              data?.tanggal
                ? new Date(data.tanggal).toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setData({ ...data, tanggal: new Date(e.target.value) })
            }
          />
          {validationErrors.find((e) => e.field === "tanggal") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "tanggal")?.message}
            </p>
          )}

          <label className="label text-base-content after:content-['*'] after:text-error">
            TMT:
          </label>
          <input
            name="tmt"
            type="date"
            className={`input input-sm focus:outline-none w-full max-w-md  bg-base-300 ${validationErrors.find((e) => e.field === "tmt") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            placeholder="Type here"
            value={
              data?.tmt ? new Date(data.tmt).toISOString().slice(0, 10) : ""
            }
            onChange={(e) =>
              setData({ ...data, tmt: new Date(e.target.value) })
            }
          />
          {validationErrors.find((e) => e.field === "tmt") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "tmt")?.message}
            </p>
          )}

          <label className="label text-base-content after:content-['*'] after:text-error">
            Jenjang:
          </label>
          <select
            name="jenjang"
            className={`select select-sm foucs:outline-none w-full max-w-md  bg-base-300 ${validationErrors.find((e) => e.field === "jenjang") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            value={data.jenjang}
            onChange={(e) => setData({ ...data, jenjang: e.target.value })}
          >
            <option disabled={true} value={""}>
              Jenjang
            </option>
            <option value={"ESELON I"}>ESELON I</option>
            <option value={"ESELON II"}>ESELON II</option>
            <option value={"ESELON III"}>ESELON III</option>
            <option value={"ESELON III"}>ESELON III</option>
            <option value={"JABATAN FUNGSIONAL"}>JABATAN FUNGSIONAL</option>
            <option value={"PELAKSANA"}>PELAKSANA</option>
            <option value={"PENSIUNAN"}>PENSIUNAN</option>
          </select>
          {validationErrors.find((e) => e.field === "jenjang") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "jenjang")?.message}
            </p>
          )}

          <label className="label text-base-content after:content-['*'] after:text-error">
            File SK:
          </label>
          <input
            name="file"
            type="file"
            className={`file-input file-input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "file") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
            accept="application/pdf"
          />
          <label className="label text-base-content">Max size 50MB</label>
          {validationErrors.find((e) => e.field === "file") && (
            <p className="text-error label font-bold">
              {validationErrors.find((e) => e.field === "file")?.message}
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
