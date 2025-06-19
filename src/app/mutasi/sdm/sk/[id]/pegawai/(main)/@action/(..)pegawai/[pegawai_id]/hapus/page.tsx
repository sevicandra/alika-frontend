"use client";
import { useContext, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = usePegawai();
  async function submitForm() {
    try {
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}`,
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
        title: "Pegawai Mutasi",
        message: "Data berhasil dihapus",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Pegawai Mutasi",
      });
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex justify-center">
        <h2 className="text-xl text-center">Are you sure?</h2>
      </div>
      <div className="flex justify-center text-center">
        <p className="text-sm">
          Data pegawai ini akan dihapus, termasuk data keluarga dan rincian
          biaya, dan tidak dapat dikembalikan lagi.
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <button className="btn btn-sm btn-error" onClick={() => router.back()}>
          Cancel
        </button>
        <button className="btn btn-sm btn-success" onClick={() => submitForm()}>
          Confirm
        </button>
      </div>
    </div>
  );
}
