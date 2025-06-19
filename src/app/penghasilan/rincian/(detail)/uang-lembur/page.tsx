"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useState, useEffect, useContext } from "react";
import { RincianContext } from "@/context/penghasilan/rincian";
import { NotificationContext } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    {
      bulan: string;
      harikerja: number;
      harilibur: number;
      jumlahmakan: number;
      uanglembur: number;
      uangmakan: number;
      pph: number;
    }[]
  >();
  const [loading, setLoading] = useState(true);
  const { tahun } = useContext(RincianContext);
  const { addNotification } = useContext(NotificationContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Penghasilan/UangLembur?tahun=${tahun}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        setData(
          data.map((item: any) => {
            return {
              bulan: item.nama_bulan,
              harikerja: item.jkerja,
              harilibur: item.jlibur,
              jumlahmakan: item.jmakan,
              uanglembur: item.lembur,
              uangmakan: item.makan,
              pph: item.pph,
            };
          }),
        );
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Uang Lembur Tahun ${tahun}`,
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
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
          "Jumlah Jam Hari Kerja",
          "Jumlah Jam Hari Libur",
          "Jumlah Uang Makan",
          "Uang Lembur",
          "Uang Makan",
          "Jumlah Bruto",
          "Potongan PPh Final",
          "Netto",
        ]}
        data={data || []}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{index + 1}</td>
            <td className="p-4">{row.bulan}</td>
            <td className="p-4">{row.harikerja}</td>
            <td className="p-4">{row.harilibur}</td>
            <td className="p-4">{row.jumlahmakan}</td>
            <td className="p-4">{row.uanglembur.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.uangmakan.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(row.uanglembur + row.uangmakan).toLocaleString("id-ID")}
            </td>
            <td className="p-4">{row.pph.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(row.uanglembur + row.uangmakan - row.pph).toLocaleString(
                "id-ID",
              )}
            </td>
          </tr>
        )}
      />
    </>
  );
};

export default Page;
