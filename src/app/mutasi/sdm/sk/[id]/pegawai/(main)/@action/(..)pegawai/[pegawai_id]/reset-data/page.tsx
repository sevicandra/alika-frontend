"use client";
import { useContext, useState, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = usePegawai();
  const [loading, setLoading] = useState(false);
  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/ResetData`,
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
        message: "Berhasil diproses",
        title: "Reset Data",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Reset Data",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Reset Data Pegawai"
      message="data pegawai ini akan direset, termasuk data keluarga dan rincian biaya, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="warning"
      icon="CircleAlert"
      loading={loading}
      confirmText="Reset"
      cancelText="Batal"
    />
  );
}
