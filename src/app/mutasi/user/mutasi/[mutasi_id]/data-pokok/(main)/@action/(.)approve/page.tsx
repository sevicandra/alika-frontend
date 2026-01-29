"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useMutasiDetail } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const router = useRouter();
  const { mutasi_id } = use(params);
  const { setRefresh } = useMutasiDetail();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const approve = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
        },
      );
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message || "Network response was not ok");
      }
      const { message } = await res.json();
      addNotification({
        message: message,
        title: "Approve Mutasi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Approve Mutasi",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title=""
      message="Data pegawai akan di setujui dan tidak dapat diubah kembali"
      onConfirm={approve}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
