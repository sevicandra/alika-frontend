"use client";
import { useNotification } from "@/context/notifikasi";
import { useEffect, useState, use } from "react";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import { snackToTitleCase } from "@/helpers/string.helper";

export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const [data, setData] = useState<
    {
      jenis: string;
      tanggal: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { mutasi_id } = use(params);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Timeline`,
        );
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message);
        }
        const { data } = await response.json();
        const timeline: { jenis: string; tanggal: string }[] = [];

        console.log(data);

        timeline.push({
          jenis: "Surat Keputusan",
          tanggal: data.tanggal,
        });

        data.Timeline.forEach((e: any) => {
          timeline.push({
            jenis: snackToTitleCase(e.Ref.nama),
            tanggal: e.tanggal,
          });
        });
        setData(timeline);
      } catch (error) {
        addNotification({
          title: "Timeline",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <DataTable
        columns={["Timeline", ""]}
        data={data}
        renderRow={(row, index) => (
          <tr key={index}>
            <td className="p-4">{row.jenis}</td>
            <td className="p-4">
              {new Date(row.tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
        )}
      />
    </>
  );
}
