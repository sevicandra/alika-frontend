"use client";
import { useContext, use, useState } from "react";
import { useTable } from "@/context/table.context";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useTable();

  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Pesawat/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "DELETE",
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: "Referensi Rute Pesawat",
        message: "Berhasil dihapus",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Referensi Rute Pesawat",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Referensi Rute Pesawat"
      message="Rute Pesawat ini akan dihapus, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
