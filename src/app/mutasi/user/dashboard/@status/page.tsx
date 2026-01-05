"use client";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
export default function Page() {
  const { addNotification } = useNotification();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    | {
        id: string;
        tanggal: Date;
        nomor: string;
        kantor_asal: string;
        kantor_tujuan: string;
        status: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/Mutasi/Pegawai/Dashboard/Status");
        if (!response.ok) {
          if (response.status === 404) {
            return;
          }
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();

        setData(data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Status Mutasi",
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);
  if (error) throw error;
  return (
    <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 px-4 py-2 text-base-content shadow shadow-base-content/10">
      <div>
        <p className="text-sm">Status Mutasi</p>
      </div>
      {loading && <Loading direction="horizontal" />}
      {!loading && !data && <p className="text-sm text-base-content/60">Tidak ada data</p>}
      {!loading && data && (
        <div className="">
          <p className="font-bold">{data?.nomor}</p>
          <p className="text-sm">
            {data?.kantor_asal} - {data?.kantor_tujuan}
          </p>
        </div>
      )}
    </div>
  );
}
