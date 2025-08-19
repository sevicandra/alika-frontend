"use client";
import { use, useState } from "react";
import { useBiaya, usePegawaiDetail } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useBiaya();
  const { setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const [loading, setLoading] = useState(false);
  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya/Reset`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
        },
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: "Reset Data Biaya",
        message: "Data berhasil dihapus",
      });
      router.back();
      setRefresh();
      setRefreshPegawai();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Reset Data Biaya",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Reset Data Biaya"
      message="Data Biaya ini akan dihapus secara permanen. Tindakan ini tidak dapat dikembalikan."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="warning"
      icon="CircleAlert"
      cancelText="Batal"
      loading={loading}
    />
  );
}
