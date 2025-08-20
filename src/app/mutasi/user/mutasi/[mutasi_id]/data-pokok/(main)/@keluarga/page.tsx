"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { snackToTitleCase } from "@/helpers/string.helper";
import ContainerCard from "@/component/Molecules/ContainerCard";

export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    {
      nama: string;
      nik: string | null;
      hubungan: string;
      tanggal_lahir: string;
      pekerjaan: string;
      is_invant: boolean;
      status: string;
      Ref: {
        nama: string;
        jenis: string;
      };
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Keluarga`,
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        setData(data);
      } catch (error) {
        addNotification({
          title: "Data Keluarga",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) throw error;

  return (
    <ContainerCard
      title="Data Keluarga"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          <DataTable
            data={data.sort((a, b) => {
              const getPriority = (d: any) => {
                if (d.Ref.jenis === "PASANGAN") return 0;
                if (d.Ref.jenis === "ANAK") return 1;
                if (d.Ref.kode === 99) return 2;
                return 3;
              };
              return getPriority(a) - getPriority(b);
            })}
            columns={[
              "No",
              "Nama",
              "NIK",
              "Hubungan",
              "Tanggal Lahir",
              "Pekerjaan",
              "Status",
            ]}
            renderRow={(item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.nik}</td>
                <td className="px-4 py-2">{item.Ref.nama}</td>
                <td className="px-4 py-2">
                  {new Date(item.tanggal_lahir).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{item.pekerjaan}</td>
                <td className="px-4 py-2">{snackToTitleCase(item.status)}</td>
              </tr>
            )}
          />
        </div>
      </div>
    </ContainerCard>
  );
}
