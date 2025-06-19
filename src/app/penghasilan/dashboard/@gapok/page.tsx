"use client";
import { useEffect, useState, useContext } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { DashboardContext } from "@/context/penghasilan/dashboard";
import Loading from "@/component/Molecules/Loading";
import StatCard from "@/component/Molecules/StatCard";
export default function Page() {
  const [data, setData] = useState<{
    netto: number;
    bruto: number;
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
  const { tahun } = useContext(DashboardContext);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gaji = await fetch("/api/Penghasilan/Gaji/Rekap?tahun=" + tahun, {
          method: "GET",
        });
        const kekurangan = await fetch(
          "/api/Penghasilan/KekuranganGaji/Rekap?tahun=" + tahun,
          {
            method: "GET",
          },
        );
        if (!gaji.ok) {
          const { message } = await gaji.json();
          throw new Error(message);
        }
        if (!kekurangan.ok) {
          const { message } = await kekurangan.json();
          throw new Error(message);
        }
        const data = (await gaji.json()).data;
        const kekuranganData = (await kekurangan.json()).data;
        setData({
          netto: (data.netto || 0) + (kekuranganData.netto || 0),
          bruto: (data.bruto || 0) + (kekuranganData.netto || 0),
        });
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: "Gaji Pokok",
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
      title="Gaji Pokok"
      value={data?.netto.toLocaleString("id-ID",{
        style: "currency",
        currency: "IDR",
      }) || 0}
      loading={loading}
    />
  );
}
