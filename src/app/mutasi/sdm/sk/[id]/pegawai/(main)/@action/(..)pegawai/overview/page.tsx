"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Organisms/Confirmation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/Overview`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "GET",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      router.back();
      // set pdf dokumen to download
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "dokumen.pdf"; // Default filename if header not found
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addNotification({
        message: `Success get overview Surat Keputusan (Status: ${res.status})`,
        title: "Overview Surat Keputusan",
      });
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Overview Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Confirmation
      title="Overview Surat Keputusan"
      message=""
      onConfirm={submitForm}
      onCancel={() => router.back()}
      variant="positive"
      icon="CircleCheck"
      cancelText="Batal"
      loading={loading}
    />
  );
}
