"use client";
import { use, useEffect, useContext, useState } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import { usePegawaiDetail, useSkDetail, useTermin } from "@/context/mutasi/sdm";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { snackToTitleCase } from "@/helpers/string.helper";
export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
    pegawai_id: string;
  }>;
}) {
  const { id, pegawai_id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      urutan: number;
      nominal: number;
      Ref: {
        nama: string;
        required_doc: JSON;
        urutan: number;
      };
    }[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useContext(NotificationContext);
  const { data: pegawai } = usePegawaiDetail();
  const { data: suratKeputusan } = useSkDetail();
  const { refresh } = useTermin();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Termin`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = await res.json();
        console.log(data);
        setData(data.data.sort((a: any, b: any) => {}));
      } catch (error) {
        addNotification({
          title: `Data Termin`,
          message: (error as Error).message,
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);
  if (error) throw error;
  return (
    <ContainerCard
      title="Termin"
      className="mx-4 overflow-x-hidden grid grid-rows-[auto_1fr]"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {loading && (
            <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
              <Loading />
            </div>
          )}
          <DataTable
            columns={["No", "Nama", "Required Doc", "Nominal", ""]}
            data={data.sort((a, b) => a.Ref.urutan - b.Ref.urutan)}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{snackToTitleCase(row.Ref.nama)}</td>
                <td className="px-4 py-2">
                  {JSON.stringify(row.Ref.required_doc)}
                </td>
                <td className="px-4 py-2">
                  {row.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="px-4 py-2">
                  {pegawai?.process_termin === "DONE" &&
                    suratKeputusan?.status === "DRAFT" && (
                      <div className="flex gap-2">
                        <Link
                          href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/termin/${row.id}/edit`}
                          className="btn btn-xs"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/termin/${row.id}/hapus`}
                          className="btn btn-xs btn-error"
                        >
                          Hapus
                        </Link>
                      </div>
                    )}
                </td>
              </tr>
            )}
          />
        </div>
        <div className=" overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
