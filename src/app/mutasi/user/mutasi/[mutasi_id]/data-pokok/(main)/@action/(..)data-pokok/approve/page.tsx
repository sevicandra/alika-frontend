"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useMutasiDetail } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
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
  const deleteData = async () => {
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
        const { message } = await res.json();
        throw new Error(message);
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
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-content-center gap-2">
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="flex justify-center">
        <h2 className="text-center text-xl">Are you sure?</h2>
      </div>
      <div className="flex justify-center">
        <p className="text-sm">
          Data pegawai akan di setujui dan tidak dapat diubah kembali
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <button className="btn btn-sm btn-error" onClick={() => router.back()}>
          Cancel
        </button>
        <button className="btn btn-sm btn-success" onClick={() => deleteData()}>
          Confirm
        </button>
      </div>
    </div>
  );
}
