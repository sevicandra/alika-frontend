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
        const tukin = await fetch(
          "/api/Penghasilan/Tukin/Rekap/?tahun=" + tahun,
          {
            method: "GET",
          },
        );
        const kekurangan = await fetch(
          "/api/Penghasilan/KekuranganTukin/Rekap?tahun=" + tahun,
          {
            method: "GET",
          },
        );
        if (!tukin.ok) {
          const { message } = await tukin.json();
          throw new Error(message);
        }
        if (!kekurangan.ok) {
          const { message } = await kekurangan.json();
          throw new Error(message);
        }

        const data = (await tukin.json()).data;
        const kekuranganData = (await kekurangan.json()).data;
        setData({
          netto: (data.netto || 0) + (kekuranganData.netto || 0),
          bruto: (data.bruto || 0) + (kekuranganData.netto || 0),
        });
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Tunjangan Kinerja",
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
        <h3>Tunjangan Kinerja</h3>
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
