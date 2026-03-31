"use client";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTahun } from "@/context/penghasilan";
import StatCard from "@/component/Molecules/StatCard";
export default function Page() {
  const [data, setData] = useState<{
    netto: number;
    bruto: number;
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const { tahun } = useTahun();
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
        const { data: gajiData, error: gajiError } = await gaji.json();
        const { data: kekuranganData, error: kekuranganError } =
          await kekurangan.json();

        if (!gaji.ok) {
          throw new Error(
            gajiError.message
              ? `${gajiError.message} (Status: ${gaji.status})`
              : "Unknown Server Error",
          );
        }
        if (!kekurangan.ok) {
          throw new Error(
            kekuranganError.message
              ? `${kekuranganError.message} (Status: ${kekurangan.status})`
              : "Unknown Server Error",
          );
        }

        setData({
          netto: (gajiData.netto || 0) + (kekuranganData.netto || 0),
          bruto: (gajiData.bruto || 0) + (kekuranganData.netto || 0),
        });
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: "Gaji Pokok",
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
      title="Gaji Pokok"
      value={
        data?.netto.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }) || 0
      }
      loading={loading}
      className="bg-base-200"
    />
  );
}
