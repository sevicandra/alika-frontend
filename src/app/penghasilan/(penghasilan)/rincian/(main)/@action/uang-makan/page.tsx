"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { useTahun } from "@/context/penghasilan";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    {
      bulan: string;
      hari: number;
      tarif: number;
      bruto: number;
      pph: number;
    }[]
  >();
  const [loading, setLoading] = useState(true);
  const { tahun } = useTahun();
  const { addNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Penghasilan/UangMakan?tahun=${tahun}`, {
          method: "GET",
        });
        const { data, error } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(
          data.map((item: any) => {
            return {
              bulan: item.nama_bulan,
              hari: item.jmlhari,
              tarif: item.tarif,
              bruto: item.bruto,
              pph: item.pph,
            };
          }),
        );
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Uang Makan Tahun ${tahun}`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, tahun]);
  if (error) throw error;
  return (
    <>
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      <DataTable
        columns={[
          "No",
          "Bulan",
          "Jumlah Hari",
          "Tarif",
          "Jumlah Bruto",
          "Pot. PPh Final",
          "Jumlah Netto",
        ]}
        data={data || []}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{index + 1}</td>
            <td className="p-4">{row.bulan}</td>
            <td className="p-4">{row.hari}</td>
            <td className="p-4">{row.tarif.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.bruto.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.pph.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(row.bruto - row.pph).toLocaleString("id-ID")}
            </td>
          </tr>
        )}
      />
    </>
  );
};

export default Page;
