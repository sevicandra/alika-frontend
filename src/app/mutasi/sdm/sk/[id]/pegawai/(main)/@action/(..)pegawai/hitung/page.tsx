"use client";
import { useContext, useEffect, useState, use } from "react";
import { usePegawai } from "@/context/mutasi/sdm";
import { NotificationContext } from "@/context/notifikasi";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = usePegawai();

  async function submitForm() {
    try {
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
      });
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex justify-center">
        <h2 className="text-xl text-center">Are you sure?</h2>
      </div>
      <div className="flex justify-center">
        <p className="text-sm">
          Apakah anda yakin untuk melakukan perhitungan rincian biaya.
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <button className="btn btn-sm btn-error" onClick={() => router.back()}>
          Cancel
        </button>
        <button className="btn btn-sm btn-success" onClick={() => submitForm()}>
          Confirm
        </button>
      </div>
    </div>
  );
}
