"use client";
import { useEffect, useState, useContext } from "react";
import { RincianContext } from "@/context/penghasilan/rincian";
import { NotificationContext } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const { tahun } = useContext(RincianContext);
  const { addNotification } = useContext(NotificationContext);
  const [data, setData] = useState<
    {
      bulan: string;
      gaji: number;
      tukin: number;
      uangMakan: number;
      uangLembur: number;
      lainLain: number;
      total: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Penghasilan/Penghasilan/Detail?tahun=${tahun}`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        setData(
          data.map((item: any) => {
            return {
              bulan: item.bulan,
              gaji: item.gaji.netto + item.kekuranganGaji.netto,
              tukin: item.tukin.netto + item.kekuranganTukin.netto,
              uangMakan: item.makan.netto,
              uangLembur: item.lembur.netto,
              lainLain: item.lain.netto,
              total:
                item.gaji.netto +
                item.kekuranganGaji.netto +
                item.tukin.netto +
                item.kekuranganTukin.netto +
                item.makan.netto +
                item.lembur.netto +
                item.lain.netto,
            };
          }),
        );
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: `Rincian Penghasilan Tahun ${tahun}`,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tahun]);

  if (error) throw error;
  return (
    <>
      {loading && (
        <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <DataTable
        columns={[
          "No",
          "Bulan",
          "Gaji Pokok",
          "Tukin",
          "Uang Makan",
          "Uang Lembur",
          "Lain-Lain",
          "Total",
        ]}
        data={data}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{index + 1}</td>
            <td className="p-4">{row.bulan}</td>
            <td className="p-4">{row.gaji.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.tukin.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.uangMakan.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.uangLembur.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.lainLain.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.total.toLocaleString("id-ID")}</td>
          </tr>
        )}
      />
    </>
  );
};

export default Page;
