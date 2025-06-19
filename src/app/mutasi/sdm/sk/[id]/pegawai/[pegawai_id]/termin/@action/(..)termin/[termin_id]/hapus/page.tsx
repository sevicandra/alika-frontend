"use client";
import { use } from "react";
import { useTermin, usePegawaiDetail } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; termin_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, termin_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const { setRefresh } = useTermin();
  async function submitForm() {
    try {
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin/${termin_id}`,
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
        title: "Hapus Termin",
        message: "Data berhasil dihapus",
      });
      router.back();
      setRefresh();
      setRefreshPegawai();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Termin",
      });
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex justify-center">
        <h2 className="text-xl text-center">Are you sure?</h2>
      </div>
      <div className="flex justify-center">
        <p className="text-sm">
          Data Termin ini akan dihapus, dan tidak dapat dikembalikan lagi.
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
