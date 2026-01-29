"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string; data_id: string }>;
}) {
  const router = useRouter();
  const { mutasi_id, data_id } = use(params);
  const { setRefresh } = useTable();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah/Data/${data_id}`,
        {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
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
        title: "Hapus Data Sanggah",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Hapus Data Sanggah",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Hapus Data Sanggah"
      message="Data yang sudah dihapus tidak dapat dikembalikan"
      onConfirm={deleteData}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
    />
  );
}
