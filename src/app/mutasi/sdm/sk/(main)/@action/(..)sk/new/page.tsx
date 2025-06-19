"use client";
import { useContext, useState } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useSk();
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  async function submitForm(formData: FormData) {
    try {
      const res = await fetch("/api/Mutasi/SDM/SuratKeputusan", {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
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
        message: `Surat Keputusan berhasil dibuat status ${res.status}`,
        title: "Surat Keputusan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
      });
    }
  }

  return (
    <form action={submitForm}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-content">
          Input Surat Keputusan
        </legend>
        <label className="label text-base-content after:content-['*'] after:text-error">
          Nomor:
        </label>
        <input
          type="text"
          className={`input input-sm focus:outline-none w-full max-w-md bg-base-300 ${validationErrors.find((e) => e.field === "nomor") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
          placeholder="Type here"
          name="nomor"
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
  );
}
