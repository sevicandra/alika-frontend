"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import { usePegawaiDetail } from "@/context/mutasi/sdm";
import { useTable } from "@/context/table.context";
import Onproccess from "@/component/Organisms/OnProcess";
import Link from "next/link";
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
  const { refresh, setRefresh } = useTable();
  const { data: pegawai, setRefresh: setRefreshPegawai } = usePegawaiDetail();
  const [data, setData] = useState<
    {
      id: string;
      nik: string;
      nama: string;
      hubungan: string;
      tanggal_lahir: Date;
      pekerjaan: string;
      is_invant: boolean;
      status: string;
      file: string;
      Ref: {
        kode: string;
        nama: string;
      };
    }[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  useEffect(() => {
    const fetchPegawai = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams();
      searchParams.append("associations", "Ref");
      try {
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga?${searchParams}`,
          {
            method: "GET",
          },
        );
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(data.sort());
      } catch (error) {
        addNotification({
          title: `Data Pegawai`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPegawai();
  }, [refresh, addNotification, id, pegawai_id]);
  if (error) throw error;
  return (
    <ContainerCard
      title="Daftar Keluarga"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {pegawai?.process_keluarga === "PROCESSING" ||
          pegawai?.process_keluarga === "RETRYING" ? (
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
                  "NIK",
                  "Nama",
                  "Hubungan",
                  "Tanggal Lahir",
                  "Pekerjaan",
                  "Is Invant",
                  "Status",
                  "",
                ]}
                data={data.sort(
                  (a, b) =>
                    new Date(a.tanggal_lahir).getTime() -
                    new Date(b.tanggal_lahir).getTime(),
                )}
                renderRow={(row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{row.nik}</td>
                    <td className="px-4 py-2">{row.nama}</td>
                    <td className="px-4 py-2">{row.Ref?.nama}</td>
                    <td className="px-4 py-2">
                      {new Date(row.tanggal_lahir).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">{row.pekerjaan}</td>
                    <td className="px-4 py-2">
                      {row.is_invant ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-4 py-2">
                      {snackToTitleCase(row.status)}
                    </td>
                    <td className="px-4 py-2">
                      {row.file && (
                        <div className="tooltip" data-tip="keluarga">
                          <Link
                            href={`/mutasi/sdm/arsip/${id}/pegawai/${pegawai_id}/keluarga/${row.id}/file`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon
                                className="hover:scale-110"
                                icon="File"
                                height={16}
                              />
                            </div>
                          </Link>
                        </div>
                      )}
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
