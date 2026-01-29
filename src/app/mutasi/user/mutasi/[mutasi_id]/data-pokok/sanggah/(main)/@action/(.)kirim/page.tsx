"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const router = useRouter();
  const { mutasi_id } = use(params);
  const { setRefresh } = useTable();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const publishSk = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah/Kirim`,
        {
          method: "POST",
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
        title: "Kirim Sanggah",
      });
      setRefresh();
      router.replace(`/mutasi/user/mutasi`);
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Kirim Sanggah",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Kirim Sanggah"
      message="Data Sanggah ini akan di kirim!"
      onConfirm={publishSk}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
