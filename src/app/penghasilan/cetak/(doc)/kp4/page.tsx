"use client";
import GroupButton from "@/component/Molecules/GroupButton";
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/lib/context/notifikasi";
import Preview from "@/component/Organisms/PdfViewer";
import Confirmation from "@/component/Molecules/Confirmation";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const [base64, setBase64] = useState<string>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { addNotification } = useContext(NotificationContext);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const file = await fetch("/api/Penghasilan/KP4/Preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
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
  }, []);

  const KirimPermohonan = async () => {
    try {
      setLoading(true);
      setOpen(false);
      const res = await fetch("/api/Penghasilan/KP4/Cetak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: `Kirim Permohonan`,
        message: `Permohonan telah dikirim`,
      });
      router.push("/penghasilan/tte");
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
    <>
      <div className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-2">
        {loading && (
          <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
            <Loading />
          </div>
        )}
        <div className="flex w-full justify-end">
          <GroupButton
            className="btn-secondary"
            button={[
              {
                name: "Kirim Permohonan",
                type: "button",
                onClick: () => setOpen(true),
              },
            ]}
          />
        </div>
        <div className="overflow-auto">
          {base64 && (
            <Preview
              base64={base64}
              fileName={`KP4 Tahun ${new Date().toLocaleDateString()}`}
            />
          )}
        </div>
        <div></div>
      </div>
      <Confirmation
        isOpen={open}
        onCancel={() => setOpen(false)}
        onConfirm={KirimPermohonan}
        message="Apakah anda yakin ingin mengirim permohonan ini?"
      />
    </>
  );
};

export default Page;
