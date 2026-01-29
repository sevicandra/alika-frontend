"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { setRefresh } = useTable();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const publishSk = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Selesai`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      const { message, error } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        title: "Surat Keputusan",
        message: `${message} (Status: ${res.status})`,
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
      title="Selesaikan Surat Keputusan"
      message="Surat Keputusan ini akan diselesaikan. Apakah anda yakin!"
      onConfirm={publishSk}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
