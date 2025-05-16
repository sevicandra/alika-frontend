"use client";
import { useEffect, useState, useContext } from "react";
import { NotificationContext } from "@/lib/context/notifikasi";
import { DashboardContext } from "@/lib/context/penghasilan/dashboard";
import Loading from "@/component/Molecules/Loading";
export default function Page() {
  const { addNotification } = useContext(NotificationContext);
  const { tahun } = useContext(DashboardContext);
  const [data, setData] = useState<{
    netto: number;
    bruto: number;
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "/api/Penghasilan/UangLembur/Rekap/?tahun=" + tahun,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        setData({
          netto: data.netto || 0,
          bruto: data.bruto || 0,
        });
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Uang Lembur",
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tahun]);
  if (error) throw error;
  return (
    <div className="bg-base-200 rounded-box grid min-h-18 grid-rows-[auto_1fr] gap-2 overflow-hidden p-2">
      <div>
        <h3>Uang Lembur</h3>
      </div>
      <div className="h-[24px]">
        {!data || loading ? (
          <Loading direction="horizontal" />
        ) : (
          <p className="font-bold">
            Rp {(data?.netto || 0).toLocaleString("id-ID")}
          </p>
        )}
      </div>
    </div>
  );
}
