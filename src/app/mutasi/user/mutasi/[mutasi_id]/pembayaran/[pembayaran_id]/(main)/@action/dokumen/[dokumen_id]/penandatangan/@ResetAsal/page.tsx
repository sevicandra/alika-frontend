"use client";
import { use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
    dokumen_id: string;
  }>;
}) {
  const router = useRouter();
  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);

  const { addNotification } = useNotification();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/KantorAsal`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "DELETE",
        },
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: `SPD Lembar 2`,
        message: "Permohonan SPD Lembar 2 Berhasil Dibatalkan",
      });
      router.back();
    } catch (error) {
      addNotification({
        title: `SPD Lembar 2`,
        message: (error as Error).message,
        variant: "error",
      });
    }
  }
  return (
    <form onSubmit={submit} autoComplete="off">
      <div className="bg-base-100 text-base-content shadow-xl">
        <div className="flex flex-col gap-2 bg-base-200/50 px-4 py-4">
          <div className="flex items-center justify-end">
            <button type="submit" className="btn text-nowrap btn-primary">
              <Icon icon="FileText" height={16} /> Reset
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
