"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTable } from "@/context/table.context";
import Confirmation from "@/component/Organisms/Confirmation";
import { useForm } from "@/context/form.context";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { input, setValidationErrors } = useForm();
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const { setRefresh } = useTable();
  const reject = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/Keuangan/PermohonanPembayaran/${id}/Setuju`,
        {
          method: "POST",
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: JSON.stringify({
            catatan: input.catatan,
          }),
        },
      );
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message);
      }

      addNotification({
        title: "Permohonan Pembayaran",
        message: "permohonan berhasil disetujui",
      });
      router.replace("/mutasi/keuangan/permohonan-pembayaran");
      setRefresh();
    } catch (error) {
      addNotification({
        title: "Permohonan Pembayaran",
        message: (error as Error).message,
        variant: "error",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Permohonan Pembayaran"
      message="Data ini akan disetujui. Apakah anda yakin?"
      onConfirm={reject}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
