"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { setRefresh } = useSk();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Publish`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      addNotification({
        message: "Berhasil dipublish",
        title: "Publish Surat Keputusan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Publish Surat Keputusan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-content-center gap-2">
      {loading && (
        <div className="text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <div className="flex justify-center">
        <h2 className="text-xl text-center">Are you sure?</h2>
      </div>
      <div className="flex justify-center">
        <p className="text-sm">
          Surat Keputusan ini akan dipublish, apakah anda yakin?
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <button className="btn btn-sm btn-error" onClick={() => router.back()}>
          Cancel
        </button>
        <button className="btn btn-sm btn-success" onClick={() => deleteData()}>
          Confirm
        </button>
      </div>
    </div>
  );
}
