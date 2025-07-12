"use client";
import { useEffect, useState, useContext } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { DashboardContext } from "@/context/penghasilan/dashboard";
import StatCard from "@/component/Molecules/StatCard";
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
          }
        );
        const kekurangan = await fetch(
          "/api/Penghasilan/KekuranganTukin/Rekap?tahun=" + tahun,
          {
            method: "GET",
          }
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
    <StatCard
      title="Tunjangan Kinerja"
      value={
        data?.netto.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }) || 0
      }
      loading={loading}
    />
  );
}
