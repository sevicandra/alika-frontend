"use client";
import { useState, useContext, useEffect } from "react";
import { CetakDocContext } from "@/lib/context/penghasilan/cetakDoc";
import { NotificationContext } from "@/lib/context/notifikasi";
import Preview from "@/component/Organisms/PdfViewer";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Molecules/Confirmation";

const Page = () => {
  const [base64, setBase64] = useState<string>();
  const [error, setError] = useState<Error | null>(null);
  const { tahun, bulan, setLoading, open, setOpen } = useContext(CetakDocContext);
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const file = await fetch("/api/Penghasilan/DaftarGaji/Preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: JSON.stringify({
            tahun,
            bulan,
          }),
        });
        if (!file.ok) {
          const { message } = await file.json();
          console.log(message);
          throw new Error(message);
        }
        const dataFile = await file.arrayBuffer();
        function arrayBufferToBase64(buffer: ArrayBuffer) {
          let binary = "";
          const bytes = new Uint8Array(buffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        }
        const base64 = arrayBufferToBase64(dataFile);
        setBase64(base64);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Preview Dokumen`,
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tahun, bulan]);

  const KirimPermohonan = async () => {
    try {
      setLoading(true);
      setOpen(false);
      const res = await fetch("/api/Penghasilan/DaftarGaji/Cetak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        body: JSON.stringify({
          tahun,
          bulan,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      router.push("/penghasilan/cetak");
      addNotification({
        title: `Kirim Permohonan`,
        message: `Permohonan telah dikirim`,
      });
    } catch (error) {
      setError(error as Error);
      addNotification({
        title: `Kirim Permohonan`,
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) throw error;
  return (
    <div className="overflow-auto">
      {base64 && (
        <Preview
          base64={base64}
          fileName={`KP4 Tahun ${new Date().toLocaleDateString()}`}
        />
      )}
      <Confirmation
        isOpen={open}
        onCancel={() => setOpen(false)}
        onConfirm={KirimPermohonan}
        message="Apakah anda yakin ingin mengirim permohonan ini?"
      />
    </div>
  );
};

export default Page;
