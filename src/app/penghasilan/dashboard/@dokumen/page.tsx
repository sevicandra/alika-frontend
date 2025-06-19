"use client";
import { useEffect, useState, useContext } from "react";
import { DataTable } from "@/component/Organisms/DataTable";
import { NotificationContext } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
export default function Page() {
  const [data, setData] = useState<
    {
      dokumen: string;
      status: number;
      file: string;
    }[]
  >();
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "/api/Penghasilan/DataCetak?limit=5&sortField=id&sortOrder=desc",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        if (res.ok) {
          const data = (await res.json()).data;
          setData(
            data.map((item: any) => ({
              dokumen: item.perihal,
              status: item.status,
              file: item.file,
            })),
          );
        }
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: "Dokumen Terbaru",
        });
      }
    };
    fetchData();
  }, []);
  if (error) throw error;

  return (
    <div className="relative">
      {!data ? (
        <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      ) : (
        <DataTable
          columns={["Dokumen", "Status", "Aksi"]}
          data={data}
          renderRow={(row, index) => (
            <tr key={index}>
              <td className="p-4">{row.dokumen}</td>
              <td className="p-4">
                {row.status === 0
                  ? "Menunggu TTE"
                  : row.status === 1
                    ? "Sudah di TTE"
                    : "Ditolak"}
              </td>
              <td className="p-4">
                {row.status === 0 ? (
                  <button className="btn btn-primary btn-xs">Lihat</button>
                ) : row.status === 1 ? (
                  <button className="btn btn-primary btn-xs">download</button>
                ) : (
                  <button className="btn btn-primary btn-xs">Lihat</button>
                )}
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}
