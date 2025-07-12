"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import { useTte } from "@/context/mutasi/user";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { setRefresh } = useTte();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Pegawai/TTE/${id}/Tolak`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: "Dokumen SPD",
        message: `berhasil di tolak`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Dokumen SPD",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Tolak Permohonan SPD Lembar 2"
      message="Permohonan ini akan di tolak"
      onConfirm={submitForm}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleAlert"
      variant="warning"
    />
  );
}
