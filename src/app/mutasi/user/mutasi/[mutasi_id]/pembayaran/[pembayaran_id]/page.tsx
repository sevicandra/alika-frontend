"use client";
import { use, useEffect, useContext, useState } from "react";
import { NotificationContext } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
  }>;
}) {
  const { mutasi_id, pembayaran_id } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useContext(NotificationContext);
  const [data, setData] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(
  //         `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran`,
  //       );
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.statusText}`);
  //       }
  //       const { data } = await response.json();
  //       setData(data);
  //     } catch (error) {
  //       setError(error as Error);
  //       addNotification({
  //         title: "Gagal Memuat Data Pembayaran Mutasi",
  //         message: `Gagal memuat data pembayaran mutasi: ${error instanceof Error ? error.message : "Unknown error"}`,
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (error) throw error;
  return (
    <ContainerCard
      title="Pembayaran Mutasi"
      headerRight={
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {/* <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama / NIP"
            value={searchTerm}
          />
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setDataKeluarga(e.target.value)}
            value={dataKeluarga || ""}
          >
            <option value="">Semua Status Data Keluarga</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setDataBiaya(e.target.value)}
            value={dataBiaya || ""}
          >
            <option value="">Semua Status Rincian Biaya</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setDataTermin(e.target.value)}
            value={dataTermin || ""}
          >
            <option value="">Semua Status Termin</option>
            <option value="IDLE">IDLE</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DONE">DONE</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select> */}
        </div>
      }
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto py-2">
          {loading && (
            <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
              <Loading />
            </div>
          )}
          {/* <DataTable
            data={data}
            columns={[
              "No",
              "Nama",
              "Tahun Anggaran",
              "Nominal",
              "Status",
              "",
            ]}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.Ref.nama}</td>
                <td className="p-4">{row.tahun}</td>
                <td className="p-4">{row.nominal.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 2,
                })}</td>
                <td className="p-4">{row.status}</td>
                <td className="p-4">
                  <Link
                    href={`/mutasi/user/mutasi/${mutasi_id}/pembayaran/${row.id}`}
                  >
                    <button className="btn btn-xs btn-primary">Detail</button>
                  </Link>
                </td>
              </tr>
            )}
          /> */}
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
