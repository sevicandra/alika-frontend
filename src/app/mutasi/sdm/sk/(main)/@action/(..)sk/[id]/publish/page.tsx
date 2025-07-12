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
  const publishSk = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Publish`, {
        method: "POST",
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
        message: "Berhasil dipublish",
        title: "Publish Surat Keputusan",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Publish Surat Keputusan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Publish Surat Keputusan"
      message="Surat Keputusan ini akan dipublish!"
      onConfirm={publishSk}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
