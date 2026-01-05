"use client";
import Preview from "@/component/Organisms/PdfViewer";
import { use, useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
export default function Page({ params }: { params: Promise<{ id: string; dokumen_id: string }> }) {
  const { id, dokumen_id } = use(params);
  const [base64, setBase64] = useState<string>();
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const file = await fetch(
          `/api/Mutasi/Keuangan/PermohonanPembayaran/${id}/Dokumen/${dokumen_id}/File`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!file.ok) {
          const { message } = await file.json();
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
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, id, dokumen_id]);

  if (error) throw error;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-box text-neutral-content shadow">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      {base64 && <Preview base64={base64} fileName={`dokumen.pdf`} />}
    </div>
  );
}
