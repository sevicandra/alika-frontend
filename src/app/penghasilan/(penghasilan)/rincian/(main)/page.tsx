"use client";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTahun } from "@/context/penghasilan";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";

const Page = () => {
  const { tahun } = useTahun();
  const { addNotification } = useNotification();
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
    <ContainerCard
      title="Rincian Penghasilan"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto">
          {loading && (
            <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
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
                <td className="p-4">
                  {row.uangLembur.toLocaleString("id-ID")}
                </td>
                <td className="p-4">{row.lainLain.toLocaleString("id-ID")}</td>
                <td className="p-4">{row.total.toLocaleString("id-ID")}</td>
              </tr>
            )}
          />
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
};

export default Page;
