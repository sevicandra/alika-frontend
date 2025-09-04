"use client";
import Preview from "@/component/Organisms/PdfViewer";
import { use, useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Tte from "@/component/Molecules/Tte";
import Confirmation from "@/component/Molecules/Confirmation";
import { useTable } from "@/context/table.context";
import Loading from "@/component/Molecules/Loading";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setRefresh } = useTable();
  const [base64, setBase64] = useState<string>();
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const [tte, setTte] = useState(false);
  const [tolak, setTolak] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const info = await fetch(`/api/Penghasilan/DataTTE/${id}`, {
          method: "GET",
        });
        if (!info.ok) {
          const { message } = await info.json();
          throw new Error(message);
        }
        const dataInfo = (await info.json()).data;
        setData(dataInfo);
        const file = await fetch(`/api/Penghasilan/File/${id}`, {
          method: "GET",
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
  }, [addNotification, id]);

  const ProcessTte = async ({ passphrase }: { passphrase: string }) => {
    try {
      setLoading(true);
      if (data.jenis === "KP4S") {
        const res = await fetch("/api/Penghasilan/TTE/KP4S", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: JSON.stringify({
            id,
            passphrase,
          }),
        });
        if (!res.ok) {
          const { errors } = await res.json();
          throw new Error(errors.message);
        }
        router.back();
        addNotification({
          title: `TTE`,
          message: `File berhasil ditandatangani`,
        });
        setRefresh();
      } else {
        const res = await fetch("/api/Penghasilan/TTE", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: JSON.stringify({
            id,
            passphrase,
          }),
        });
        if (!res.ok) {
          const { errors } = await res.json();
          throw new Error(errors.message);
        }
        router.back();
        addNotification({
          title: `TTE`,
          message: `File berhasil ditandatangani`,
        });
        setRefresh();
      }
    } catch (error) {
      addNotification({
        title: `TTE`,
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setTte(false);
      setLoading(false);
    }
  };

  const tolakTte = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Penghasilan/DataCetak/${id}/Tolak`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      router.back();
      addNotification({
        title: `TTE`,
        message: `File berhasil ditolak`,
      });
      setRefresh();
    } catch (error) {
      addNotification({
        title: `TTE`,
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setTolak(false);
      setLoading(false);
    }
  };

  if (error) throw error;
  return (
    <div
      className="grid h-full w-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-2 md:p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap justify-between gap-1">
        <div>
          <button onClick={() => router.back()} className="btn btn-sm">
            <FiX className="text-sm" />
            <p className="hidden md:block">Kembali</p>
          </button>
        </div>
        <div>
          {data.status === 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setTolak(true)}
                className="btn btn-sm btn-error md:w-24"
              >
                Tolak
              </button>
              <button
                onClick={() => setTte(true)}
                className="btn btn-sm btn-success md:w-24"
              >
                TTE
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="relative grid h-full w-full grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-neutral text-neutral-content shadow">
          {loading && (
            <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
              <Loading />
            </div>
          )}
          {base64 && (
            <Preview
              base64={base64}
              fileName={`[${data?.jenis}] ${data?.perihal} ${data?.nip_tujuan}`}
            />
          )}
        </div>
      </div>
      <Tte
        isOpen={tte}
        onConfirm={ProcessTte}
        onCancel={() => setTte(false)}
        title="Please Input Passpharse!"
      />
      <Confirmation
        isOpen={tolak}
        onCancel={() => setTolak(false)}
        onConfirm={() => tolakTte()}
        message="Are you sure you want to reject this document?"
      />
    </div>
  );
}
