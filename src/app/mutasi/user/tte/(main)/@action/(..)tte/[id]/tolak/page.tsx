"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";
import { useTable } from "@/context/table.context";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { setRefresh } = useTable();
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
      const { message, error } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        title: "Tolak TTE",
        message: `${message} (Status: ${res.status})`,
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Tolak TTE",
        variant: "error",
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
