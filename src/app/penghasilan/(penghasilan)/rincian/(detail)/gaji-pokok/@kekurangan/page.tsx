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
      gapok: number;
      istri: number;
      anak: number;
      umum: number;
      str: number;
      bulat: number;
      beras: number;
      pajak: number;
      lain: number;
      iwp: number;
      pph: number;
      rumdin: number;
      potlain: number;
      taperum: number;
      bpjs: number;
      bpjs2: number;
    }[]
  >();
  const [loading, setLoading] = useState(true);
  const { tahun } = useTahun();
  const { addNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Penghasilan/KekuranganGaji?tahun=${tahun}`,
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
          setData(
            data.map((item: any) => {
              return {
                bulan: item.nama_bulan,
                gapok: item.gapok,
                istri: item.tistri,
                anak: item.tanak,
                umum: item.tumum + item.ttambumum,
                str: item.tstruktur + item.tfungsi,
                bulat: item.bulat,
                beras: item.tberas,
                pajak: item.tpajak,
                lain: item.tpapua + item.tlain + item.tpencil,
                iwp: item.iwp,
                pph: item.pph,
                rumdin: item.sewarmh,
                potlain:
                  item.pberas + item.tunggakan + item.utanglebih + item.potlain,
                taperum: item.taperum,
                bpjs: item.bpjs,
                bpjs2: item.bpjs2,
              };
            }),
          );
        }
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: `Kekurangan Gaji ${tahun}`,
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
        <div className="bg-primary-300/50 text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <DataTable
        columns={[
          "No",
          "Bulan",
          "Gapok",
          "Tunj. Istri",
          "Tunj. Anak",
          "Tunj. Umum",
          "Tunj. Fungsional/Struktural",
          "Pembulatan",
          "Tunj. Beras",
          "Tunj. Pajak",
          "Tunj. Lain-Lain",
          "Total Bruto",
          "Pot. IWP",
          "Pot. PPh",
          "Pot. Rumdin",
          "Pot. Lain-Lain",
          "Pot. Taperum",
          "Pot. BPJS",
          "Pot. BPJS Kel. Lain",
          "Jumlah Potongan",
          "Jumlah Netto",
        ]}
        data={data ?? []}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{index + 1}</td>
            <td className="p-4">{row.bulan}</td>
            <td className="p-4">{row.gapok.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.istri.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.anak.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.umum.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.str.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.bulat.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.beras.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.pajak.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.lain.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(
                row.gapok +
                row.istri +
                row.anak +
                row.umum +
                row.str +
                row.bulat +
                row.beras +
                row.pajak +
                row.lain
              ).toLocaleString("id-ID")}
            </td>
            <td className="p-4">{row.iwp.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.pph.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.rumdin.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.potlain.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.taperum.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.bpjs.toLocaleString("id-ID")}</td>
            <td className="p-4">{row.bpjs2.toLocaleString("id-ID")}</td>
            <td className="p-4">
              {(
                row.iwp +
                row.pph +
                row.rumdin +
                row.potlain +
                row.taperum +
                row.bpjs +
                row.bpjs2
              ).toLocaleString("id-ID")}
            </td>
            <td className="p-4">
              {(
                row.gapok +
                row.istri +
                row.anak +
                row.umum +
                row.str +
                row.bulat +
                row.beras +
                row.pajak +
                row.lain -
                (row.iwp +
                  row.pph +
                  row.rumdin +
                  row.potlain +
                  row.taperum +
                  row.bpjs +
                  row.bpjs2)
              ).toLocaleString("id-ID")}
            </td>
          </tr>
        )}
      />
    </>
  );
};

export default Page;
