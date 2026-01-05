"use client";
import { use, useState } from "react";
import { usePegawaiDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; termin_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, termin_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    try {
      setLoading(true);
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
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Reset Data Termin"
      message="Data Termin ini akan dihapus, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
