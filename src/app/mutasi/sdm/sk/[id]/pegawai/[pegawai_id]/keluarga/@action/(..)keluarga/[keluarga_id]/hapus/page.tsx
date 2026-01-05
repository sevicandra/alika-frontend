"use client";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; keluarga_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, keluarga_id } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga/${keluarga_id}`,
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
        title: "Hapus Data Keluarga",
        message: "berhasil dihapus",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Data Keluarga",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Hapus Keluarga"
      message="Data keluarga ini akan dihapus secara permanen. Tindakan ini tidak dapat dikembalikan."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
