"use client";
import { useState, use } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/ProcessKeluarga`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
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
        message: `${message} (Status: ${res.status})`,
        title: "Proses Data Keluarga",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Proses Data Keluarga",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Proses Data Keluarga"
      message="Apakah anda yakin untuk melakukan proses data keluarga?"
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="positive"
      icon="CircleCheck"
      cancelText="Batal"
      loading={loading}
    />
  );
}
