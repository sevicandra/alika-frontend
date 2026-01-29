"use client";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();

  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Admin/Referensi/Darat/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "DELETE",
      });
      const { error, message } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        title: "Hapus Referensi Rute Darat",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Referensi Rute Darat",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Hapus Rute Darat"
      message="Rute Darat ini akan dihapus, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
