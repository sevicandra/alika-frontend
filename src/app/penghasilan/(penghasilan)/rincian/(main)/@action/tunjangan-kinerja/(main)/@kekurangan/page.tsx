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
      grade: string;
      tunjangan_kinerja: number;
      tunjangan_pajak: number;
      pot_absesi: number;
      pot_pph: number;
    }[]
  >();
  const [loading, setLoading] = useState(true);
  const { tahun } = useTahun();
  const { addNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Penghasilan/KekuranganTukin?tahun=${tahun}`,
          {
            method: "GET",
          },
        );
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
              grade: item.grade,
              tunjangan_kinerja: item.tjpokok + item.tjtamb,
              tunjangan_pajak: item.tkpph,
              pot_absesi: item.abspotr,
              pot_pph: item.potpph,
            };
          }),
        );
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Kekurangan Tunjangan Kinerja ${tahun}`,
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
          "Grade",
          "Tunjangan Kinerja",
          "Tunj. Pajak",
          "Total Bruto",
          "Pot. Absensi (%)",
          "Pot. PPh",
          "Jumlah Potongan",
          "Jumlah Netto",
        ]}
        data={data || []}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{index + 1}</td>
            <td className="p-4">{row.bulan}</td>
            <td className="p-4">{row.grade}</td>
            <td className="p-4">
              {row.tunjangan_kinerja.toLocaleString("id-ID")}
            </td>
            <td className="p-4">
              {row.tunjangan_pajak.toLocaleString("id-ID")}
            </td>
            <td className="p-4">
              {(row.tunjangan_kinerja + row.tunjangan_pajak).toLocaleString(
                "id-ID",
              )}
            </td>
            <td className="p-4">
              {row.pot_absesi.toLocaleString("id-ID")} (
              {((row.pot_absesi / row.tunjangan_kinerja) * 100).toFixed(2)}%)
            </td>
            <td className="p-4">{row.pot_pph.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(row.pot_absesi + row.pot_pph).toLocaleString("id-ID")}
            </td>
            <td className="p-4">
              {(
                row.tunjangan_kinerja +
                row.tunjangan_pajak -
                (row.pot_absesi + row.pot_pph)
              ).toLocaleString("id-ID")}
            </td>
          </tr>
        )}
      />
    </>
  );
};

export default Page;
