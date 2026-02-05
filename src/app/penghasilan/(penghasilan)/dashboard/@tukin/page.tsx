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

        const { data: tukinData, error: tukinError } = await tukin.json();
        const { data: kekuranganData, error: kekuranganError } =
          await kekurangan.json();

        if (!tukin.ok) {
          throw new Error(
            tukinError.message
              ? `${tukinError.message} (Status: ${tukin.status})`
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
          netto: (tukinData.netto || 0) + (kekuranganData.netto || 0),
          bruto: (tukinData.bruto || 0) + (kekuranganData.netto || 0),
        });
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Tunjangan Kinerja",
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
