"use client";
import { useEffect, useState, useContext } from "react";
import Cart from "@/component/Organisms/riwayatPenghasilanCart";
import { NotificationContext } from "@/lib/context/notifikasi";
import { DashboardContext } from "@/lib/context/penghasilan/dashboard";
import Loading from "@/component/Molecules/Loading";
export default function Page() {
  const [data, setData] = useState<
    {
      bulan: string;
      gaji: number;
      tukin: number;
      umak: number;
      lembur: number;
    }[]
  >([]);

  const [error, setError] = useState<Error | null>(null);
  const { tahun } = useContext(DashboardContext);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useContext(NotificationContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const penghasilan = await fetch(
          `/api/Penghasilan/Penghasilan/Detail?tahun=${tahun}`,
          {
            method: "GET",
          },
        );
        const penghasilan2 = await fetch(
          `/api/Penghasilan/Penghasilan/Detail?tahun=${tahun - 1}`,
          {
            method: "GET",
          },
        );
        const penghasilan3 = await fetch(
          `/api/Penghasilan/Penghasilan/Detail?tahun=${tahun - 2}`,
          {
            method: "GET",
          },
        );
        if (!penghasilan.ok || !penghasilan2.ok || !penghasilan3.ok) {
          const data = await penghasilan.json();
          throw new Error(data.error_description);
        }
        const data1 = (await penghasilan.json()).data;
        const data2 = (await penghasilan2.json()).data;
        const data3 = (await penghasilan3.json()).data;
        const ref1 = data1.map((item: any) => {
          return {
            bulan: item.bulan + " " + tahun,
            gaji: item.gaji.netto + item.kekuranganGaji.netto,
            tukin: item.tukin.netto + item.kekuranganTukin.netto,
            umak: item.makan.netto,
            lembur: item.lembur.netto,
          };
        });
        const ref2 = data2.map((item: any) => {
          return {
            bulan: item.bulan + " " + (tahun - 1),
            gaji: item.gaji.netto + item.kekuranganGaji.netto,
            tukin: item.tukin.netto + item.kekuranganTukin.netto,
            umak: item.makan.netto,
            lembur: item.lembur.netto,
          };
        });
        const ref3 = data3.map((item: any) => {
          return {
            bulan: item.bulan + " " + (tahun - 2),
            gaji: item.gaji.netto + item.kekuranganGaji.netto,
            tukin: item.tukin.netto + item.kekuranganTukin.netto,
            umak: item.makan.netto,
            lembur: item.lembur.netto,
          };
        });
        setData([...ref3, ...ref2, ...ref1]);
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: "Penghasilan Bulanan",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tahun]);
  if (error) throw error;
  return (
    <div className="bg-base-100 relative w-full overflow-hidden p-2">
      {loading && (
        <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <Cart data={data} />
    </div>
  );
}
