"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useTermin } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
    dokumen_id: string;
  }>;
}) {
  const router = useRouter();
  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);
  const { setRefresh } = useTermin();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/File`,
        {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
        },
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      addNotification({
        message: "Berhasil dihapus",
        title: "Dokumen",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Dokumen",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Dokumen"
      message="Data yang sudah dihapus tidak dapat dikembalikan"
      onConfirm={deleteData}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
    />
  );
}
