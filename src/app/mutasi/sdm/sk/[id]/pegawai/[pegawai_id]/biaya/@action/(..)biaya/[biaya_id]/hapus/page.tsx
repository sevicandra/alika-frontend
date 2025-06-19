"use client";
import { useContext, use, useState } from "react";
import { useBiaya } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; biaya_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, biaya_id } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useBiaya();
  async function submitForm() {
    try {
      setLoading(true);
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
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: "Hapus Data Biaya",
        message: "Berhasil dihapus",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Data Biaya",
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
      <div className="grid gap-2">
        <div className="flex justify-center">
          <h2 className="text-xl text-center">Are you sure?</h2>
        </div>
        <div className="flex justify-center">
          <p className="text-sm">
            Data Biaya ini akan dihapus, dan tidak dapat dikembalikan lagi.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <button
            className="btn btn-sm btn-error"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => submitForm()}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
