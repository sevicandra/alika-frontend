"use client";
import { useState, use } from "react";
import { useSanggahContext } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { revisi } = useSanggahContext();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const { mutasi_id } = use(params);
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);

    if (revisi.length === 0) {
      addNotification({
        title: "Sanggah Mutasi",
        message: "Tidak ada data revisi untuk dikirim.",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      revisi.forEach((item, i) => {
        if (item.action === "add") {
          formData.append(
            `data[${i}][data]`,
            JSON.stringify({
              ...item.data,
            }),
          );
          formData.append(`data[${i}][file]`, item.file);
          formData.append(`data[${i}][catatan]`, item.catatan);
        }

        if (item.action === "edit") {
          formData.append(
            `data[${i}][data]`,
            JSON.stringify({
              ...item.data,
            }),
          );
          if (item.file) formData.append(`data[${i}][file]`, item.file);
          formData.append(`data[${i}][catatan]`, item.catatan);
          formData.append(`data[${i}][id]`, item.id);
        }

        if (item.action === "remove") {
          formData.append(`data[${i}][id]`, item.id);
          formData.append(`data[${i}][catatan]`, item.catatan);
        }

        formData.append(`data[${i}][action]`, item.action);
      });
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422 && errors && Array.isArray(errors)) {
          for (const error of errors) {
            addNotification({
              title: "Sanggah Mutasi",
              message: error.message,
            });
          }
        }
        throw new Error(message);
      }
      addNotification({
        title: "Sanggah Mutasi",
        message: "Data berhasil dikirimkan",
      });
      router.replace("/mutasi/user/mutasi");
    } catch (error) {
      addNotification({
        title: "Sanggah Mutasi",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Confirmation
      title="Kirim Permohonan Sanggah"
      message="apakah anda yakin ingin mengirimkan data ini?"
      onConfirm={handleSubmit}
      onCancel={() => router.back()}
      loading={loading}
      icon="CircleCheck"
      variant="positive"
    />
  );
}
