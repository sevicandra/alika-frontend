"use client";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTahun } from "@/context/penghasilan";
import StatCard from "@/component/Molecules/StatCard";
export default function Page() {
  const { addNotification } = useNotification();
  const { tahun } = useTahun();
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
          "/api/Penghasilan/UangMakan/Rekap/?tahun=" + tahun,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        if (res.ok) {
          const data = (await res.json()).data;
          setData({
            netto: data.netto || 0,
            bruto: data.bruto || 0,
          });
        }
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Uang Makan",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tahun, addNotification]);
  if (error) throw error;
  return (
    <StatCard
      title="Uang Makan"
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
