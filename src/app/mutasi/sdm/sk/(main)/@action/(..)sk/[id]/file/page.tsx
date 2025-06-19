"use client";
import Preview from "@/component/Organisms/PdfViewer";
import { use, useState, useEffect, useContext } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [base64, setBase64] = useState<string>();
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const info = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
          method: "GET",
        });
        if (!info.ok) {
          const { message } = await info.json();
          throw new Error(message);
        }
        const dataInfo = (await info.json()).data;
        setData(dataInfo);
        const file = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}/File`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) throw error;
  return (
    <div
      className="grid h-full w-full grid-rows-[auto_1fr] gap-1 overflow-hidden rounded-box bg-base-200 border border-base-content/20 shadow shadow-base-content/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap justify-end gap-1 py-2 px-4">
        <div>
          <button onClick={() => router.back()} className="btn btn-xs btn-error btn-circle">
            <FiX className="" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="text-neutral-content rounded-box relative h-full w-full overflow-hidden shadow">
          {loading && (
            <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
              <Loading />
            </div>
          )}
          {base64 && <Preview base64={base64} fileName={`[${data?.nomor}] - ${data?.uraian}`} />}
        </div>
      </div>
    </div>
  );
}
