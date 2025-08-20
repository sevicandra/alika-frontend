"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useSk } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { setRefresh } = useSk();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      addNotification({
        message: "Berhasil dihapus",
        title: "Surat Keputusan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Surat Keputusan"
      message="Data yang sudah dihapus tidak dapat dikembalikan"
      onConfirm={deleteData}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
    />
  );
}
