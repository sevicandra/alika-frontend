"use client";
import Form from "@/components/organisms/forms/tte.form.organism";
import { use } from "react";
import { useRouter } from "next/navigation";
import { usePembayaranDetail } from "@/context/mutasi/user";
import { useTable } from "@/context/table.context";

export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
  }>;
}) {
  const router = useRouter();
  const { setRefresh } = useTable();
  const { setRefresh: refreshPembayaran } = usePembayaranDetail();
  const { mutasi_id, pembayaran_id } = use(params);
  const action = async (data: {
    passphrase: string;
    confirmation: boolean;
  }) => {
    return await fetch(
      `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Kirim`,
      {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          passphrase: data.passphrase,
          confirmation: data.confirmation,
        }),
      },
    );
  };
  const successAction = () => {
    router.back();
    setRefresh();
    refreshPembayaran();
  };
  return (
    <Form action={action} onCancel={router.back} onSuccess={successAction} />
  );
}
