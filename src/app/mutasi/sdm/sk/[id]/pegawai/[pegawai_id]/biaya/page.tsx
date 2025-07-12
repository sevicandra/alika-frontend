"use client";
import { use, useEffect, useContext, useState } from "react";
import { NotificationContext } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import { useBiaya, usePegawaiDetail } from "@/context/mutasi/sdm";
import Onproccess from "@/component/Molecules/Onproccess";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { snackToTitleCase } from "@/helpers/string.helper";
import Icon from "@/component/Atoms/LabelIcon";

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
      id: number;
      volume: number;
      harga_satuan: number;
      jenis: string;
      sub_jenis: string;
      keterangan: string;
      urutan: number;
    }[]
  >([]);
  const { data: pegawai, setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useContext(NotificationContext);
  const { setRefresh } = useBiaya();
  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const {data} = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          title: `Data Pegawai`,
          message: (error as Error).message,
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPegawai();
  }, [setRefresh]);

  if (error) throw error;
  return (
    <ContainerCard
      title="Rincian Biaya"
      headerRight={
        <p className="font-bold">
          {data
            .reduce((total, item) => total + item.volume * item.harga_satuan, 0)
            .toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
        </p>
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {pegawai?.process_biaya === "PROCESSING" ||
          pegawai?.process_biaya === "RETRYING" ? (
            <Onproccess
              refresh={() => {
                setRefresh();
                setRefreshPegawai();
              }}
            />
          ) : (
            <>
              {loading && (
                <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
                  <Loading />
                </div>
              )}
              <DataTable
                columns={[
                  "No",
                  "Jenis",
                  "Sub Jenis",
                  "Keterangan",
                  "Volume",
                  "Harga Satuan",
                  "Total",
                  "",
                ]}
                data={data}
                renderRow={(row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{snackToTitleCase(row.jenis)}</td>
                    <td className="px-4 py-2">
                      {row.sub_jenis ? row.sub_jenis : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {row.keterangan ? row.keterangan : "-"}
                    </td>
                    <td className="px-4 py-2">{row.volume}</td>
                    <td className="px-4 py-2">
                      {row.harga_satuan.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {(row.volume * row.harga_satuan).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {pegawai?.process_termin === "IDLE" &&
                          pegawai?.process_biaya === "DONE" && (
                            <>
                              <div className="tooltip" data-tip="edit">
                                <Link
                                  href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/biaya/${row.id}/edit`}
                                >
                                  <div className="rounded-box bg-info/80 p-1 text-info-content">
                                    <Icon
                                      className="hover:scale-110"
                                      icon="SquarePen"
                                      height={16}
                                    />
                                  </div>
                                </Link>
                              </div>
                              <div className="tooltip" data-tip="hapus">
                                <Link
                                  href={`/mutasi/sdm/sk/${id}/pegawai/${pegawai_id}/biaya/${row.id}/hapus`}
                                >
                                  <div className="rounded-box bg-error/80 p-1 text-error-content">
                                    <Icon
                                      className="hover:scale-110"
                                      icon="Trash2"
                                      height={16}
                                    />
                                  </div>
                                </Link>
                              </div>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                )}
              />
            </>
          )}
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
