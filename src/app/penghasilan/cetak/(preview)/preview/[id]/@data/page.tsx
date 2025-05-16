"use client";
import Preview from "@/component/Organisms/PdfViewer";
import { use, useState, useEffect, useContext } from "react";
import { NotificationContext } from "@/lib/context/notifikasi";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [base64, setBase64] = useState<string>();
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await fetch(`/api/Penghasilan/DataCetak/${id}`, {
          method: "GET",
        });
        if (!info.ok) {
          const { message } = await info.json();
          throw new Error(message);
        }
        const dataInfo = (await info.json()).data;
        setData(dataInfo);
        const file = await fetch("/api/Penghasilan/File", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: JSON.stringify({
            id: id,
          }),
        });
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
        });
      }
    };
    fetchData();
  }, []);
  if (error) throw error;
  return (
    base64 && (
      <Preview
        base64={base64}
        fileName={`[${data?.jenis}] ${data?.perihal} ${data?.nip_tujuan}`}
      />
    )
  );
}
