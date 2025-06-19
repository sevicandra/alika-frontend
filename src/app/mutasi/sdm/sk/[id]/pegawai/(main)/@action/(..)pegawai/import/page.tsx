"use client";
import { useContext, use, useState } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = usePegawai();
  const [loading, setLoading] = useState(false);
  async function submitForm(formData: FormData) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/ImportCSV`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        message: "Berhasil dibuat",
        title: "Pegawai Mutasi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Pegawai Mutasi",
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
      <form action={submitForm}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content">
            Import Pegawai
          </legend>
          <input
            name="file"
            type="file"
            className="file-input file-input-sm focus:outline-none w-full max-w-md  bg-base-100 text-base-content border-base-100"
            accept="text/csv"
            required
          />
          <button type="submit" className="btn btn-sm mt-4 btn-accent">
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
}
