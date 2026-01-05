"use client";
import { use, useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Icon from "@/component/Atoms/LabelIcon";
import { DataTable } from "@/component/Organisms/DataTable";
import Loading from "@/component/Molecules/Loading";
import { usePayroll } from "@/context/mutasi/keu";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    termin,
    addTerminId,
    removeTerminId,
    refresh,
    searchTerm,
    setSearchTerm,
    search,
    status,
    setStatus,
    tahap,
    setTahap,
  } = usePayroll();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const [data, setData] = useState<
    {
      id: string;
      tahun: string;
      nominal: number;
      status: "PAID" | "APPROVED_KEU";
      nama: string;
      urutan: string;
      pegawai: {
        nama: string;
        nip: string;
      };
      rekening: {
        nama: string | undefined;
        bank: string | undefined;
        nomor: string | undefined;
      };
      payroll: {
        tahap: string;
        tanggal: Date | null;
      };
    }[]
  >([]);
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());
        if (search) searchParams.append("search", search);
        if (status) searchParams.append("status", status);
        if (tahap) searchParams.append("tahap", `Tahap ${tahap}`);
        const res = await fetch(`/api/Mutasi/Keuangan/Payroll/${id}/Termin?${searchParams}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data, meta } = await res.json();
        setData(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          title: "Error Fetch Data Pembayaran",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, currentPage, limit, search, status, tahap, addNotification, id, setTotalPage]);
  return (
    <ContainerCard
      title="Payroll Pegawai"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
      headerRight={
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama / NIP"
            value={searchTerm}
          />
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) => setStatus(e.target.value)}
            value={status || ""}
          >
            <option value="">Semua Status</option>
            <option value="APPROVED_KEU">UNPAID</option>
            <option value="PAID">PAID</option>
          </select>
          <input
            onChange={(e) => setTahap(e.target.value)}
            type="number"
            className="input-bordered input input-xs focus:outline-none"
            placeholder="Cari berdasarkan Tahap Payroll"
            value={tahap}
          />
        </div>
      }
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto">
          <DataTable
            columns={["", "No", "Nama/NIP", "Rekening", "Biaya", "Termin", "Tahap", ""]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  {row.status === "APPROVED_KEU" && (
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-info"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addTerminId(row.id, row.nominal, row.pegawai.nama, row.pegawai.nip);
                        } else {
                          removeTerminId(row.id);
                        }
                      }}
                      checked={termin.some((terminId) => terminId.id === row.id)}
                    />
                  )}
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <div>
                    <div>{row.pegawai.nama}</div>
                    <div>{row.pegawai.nip}</div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  {row.rekening.nama ? (
                    <div>
                      <div>{row.rekening.nama}</div>
                      <div>{row.rekening.bank}</div>
                      <div>{row.rekening.nomor}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Tidak ada rekening</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {row.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="px-4 py-2">{row.nama}</td>
                <td className="px-4 py-2">
                  <div>
                    <div>{row.payroll.tahap}</div>
                    <div>
                      {row.payroll.tanggal
                        ? new Date(row.payroll.tanggal).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Belum Dibayar"}
                    </div>
                  </div>
                </td>
                <td className="overflow-hidden px-4 py-2">
                  <div className="flex gap-1">
                    {row.status === "APPROVED_KEU" && (
                      <div className="tooltip" data-tip="edit">
                        <Link href={`/mutasi/keuangan/payroll/${id}/termin/${row.id}/edit`}>
                          <div className="rounded-box bg-info/80 p-1 text-info-content">
                            <Icon className="hover:scale-110" icon="SquarePen" height={16} />
                          </div>
                        </Link>
                      </div>
                    )}
                    <div className="tooltip" data-tip="tolak">
                      <Link href={`/mutasi/keuangan/payroll/${id}/termin/${row.id}/tolak`}>
                        <div className="rounded-box bg-error/80 p-1 text-error-content">
                          <Icon className="hover:scale-110" icon="CircleX" height={16} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </ContainerCard>
  );
}
