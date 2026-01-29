"use client";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; biaya_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, biaya_id } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
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
        },
      );
      const { message, error } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        title: "Hapus Data Biaya",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Data Biaya",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Hapus Biaya"
      message="Data Biaya ini akan dihapus, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
