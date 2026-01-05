"use client";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({
  params,
}: {
  params: Promise<{ service_kode: string; scope_kode: string }>;
}) {
  const router = useRouter();
  const { service_kode, scope_kode } = use(params);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();

  async function submitForm() {
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/Service/${service_kode}/Scope/${scope_kode}`, {
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
        title: "Hapus Scope",
        message: "Berhasil dihapus",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Scope",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Hapus Scope"
      message="Scope ini akan dihapus, dan tidak dapat dikembalikan lagi."
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="destructive"
      icon="Trash2"
      cancelText="Batal"
      loading={loading}
    />
  );
}
