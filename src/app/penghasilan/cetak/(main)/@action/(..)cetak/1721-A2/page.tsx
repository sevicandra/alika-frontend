"use client";
import { useState, useEffect } from "react";
import { useCetak } from "@/context/penghasilan/Cetak.context";
import { useNotification } from "@/context/notifikasi";
import Preview from "@/component/Organisms/PdfViewer";
import { useRouter } from "next/navigation";
import Confirmation from "@/component/Molecules/Confirmation";
import GroupButton from "@/component/Molecules/GroupButton";
import Loading from "@/component/Molecules/Loading";
import { useTable } from "@/context/table.context";

const Page = () => {
  const [base64, setBase64] = useState<string>();
  const [error, setError] = useState<Error | null>(null);
  const { setRefresh } = useTable();
  const { tahun, bulan, setLoading, open, setOpen, loading, setTahun } =
    useCetak();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [tahuns, setTahuns] = useState<{ tahun: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/Penghasilan/DataSptPegawai/Tahun", {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        data.sort((a: any, b: any) => {
          return b.tahun - a.tahun;
        });
        while (data[0].tahun != new Date().getFullYear() - 1) {
          data.unshift({ tahun: `${Number(data[0].tahun) + 1}` });
        }
        setTahuns(data);
        setTahun(
          data
            .sort(
              (a: { tahun: number }, b: { tahun: number }) => b.tahun - a.tahun,
            )[0]
            .tahun.toString(),
        );
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: `Tahun`,
          variant: "error",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const file = await fetch("/api/Penghasilan/1721-A2/Preview", {
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
        setBase64(undefined);
        addNotification({
          title: `Preview Dokumen`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (tahun) {
      fetchData();
    }
  }, [tahun]);

  const KirimPermohonan = async () => {
    if (!tahun || !bulan) {
      addNotification({
        message: "tahun atau bulan belum dipilih",
        title: "Permohonan",
        variant: "error",
      });
      return;
    }
    try {
      setLoading(true);
      setOpen(false);
      const res = await fetch("/api/Penghasilan/1721-A2/Cetak", {
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
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: `Kirim Permohonan`,
        message: `Permohonan telah dikirim`,
      });
      setRefresh();
      router.back();
    } catch (error) {
      addNotification({
        title: `Kirim Permohonan`,
        message: (error as Error).message,
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) throw error;
  return (
    <div className="relative grid max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      <div className="flex w-full justify-between gap-2 px-4">
        <div className="justify-left flex gap-1">
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setTahun(e.target.value)}
            value={tahun || ""}
          >
            {tahuns.map((item) => (
              <option key={item.tahun} value={item.tahun}>
                {item.tahun}
              </option>
            ))}
          </select>
        </div>
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
            fileName={`SKP Tahun ${new Date().toLocaleDateString()} Bulan ${bulan}`}
          />
        )}
        <Confirmation
          isOpen={open}
          onCancel={() => setOpen(false)}
          onConfirm={KirimPermohonan}
          message="Apakah anda yakin ingin mengirim permohonan ini?"
        />
      </div>
    </div>
  );
};

export default Page;
