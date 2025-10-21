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
    if(loading) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Hitung`, {
        headers: {
          "Content-Type": "application/json",
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
        message: "Berhasil diproses",
        title: "Hitung Biaya Mutasi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hitung Biaya Mutasi",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Hitung Biaya Mutasi"
      message="Apakah anda yakin untuk melakukan perhitungan rincian biaya?"
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="positive"
      icon="CircleCheck"
      confirmText="Hitung"
      cancelText="Batal"
      loading={loading}
    />
  );
}
