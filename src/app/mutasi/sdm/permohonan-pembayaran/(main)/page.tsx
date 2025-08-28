"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { usePermohonanPembayaran } from "@/context/mutasi/sdm";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { refresh, search, searchTerm, setSearchTerm } =
    usePermohonanPembayaran();

  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [data, setData] = useState<
    {
      id: string;
      ref_termin: string;
      pegawai_id: string;
      tahun: string;
      nominal: number;
      status:
        | "DRAFT"
        | "PENDING"
        | "WAITING_APPROVAL"
        | "WAITING_APPROVAL_SDM"
        | "APPROVED_SDM"
        | "WAITING_APPROVAL_KEU"
        | "APPROVED_KEU"
        | "PAID"
        | "REJECTED";
      admin_notes: string;
      submitted_at: Date | null;
      reviewed_at: Date | null;
      created_at: Date;
      Pegawai: {
        nama: string;
        nip: string;
        KantorAsal: {
          kantor: string;
        };
        KantorTujuan: {
          kantor: string;
        };
        SuratKeputusan: {
          nomor: string;
          jenjang: string;
        };
      };
      Ref: {
        nama: string;
      };
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (limit) searchParams.append("offset", (currentPage - 1).toString());
        if (search) searchParams.append("search", search);
        const res = await fetch(
          `/api/Mutasi/SDM/PermohonanPembayaran?${searchParams}`,
          {
            method: "GET",
          },
        );

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }

        const { data, meta } = await res.json();
        setData(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, search, limit, currentPage]);

  return (
    <ContainerCard
      title="Daftar Pengajuan Pembayaran"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-bordered input input-xs w-xs focus:outline-none"
            placeholder="Cari berdasarkan Nama/NIP"
            value={searchTerm}
          />
        </div>
      }
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
            columns={[
              "No",
              "Nama",
              "NIP",
              "Jenis Pembayaran",
              "Nomor SK",
              "Jenjang",
              "Kantor Asal",
              "Kantor Tujuan",
              "",
            ]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.Pegawai.nama}</td>
                <td className="p-4">{row.Pegawai.nip}</td>
                <td className="p-4">{row.Ref.nama}</td>
                <td className="p-4">{row.Pegawai.SuratKeputusan.nomor}</td>
                <td className="p-4">{row.Pegawai.SuratKeputusan.jenjang}</td>
                <td className="p-4">{row.Pegawai.KantorAsal.kantor}</td>
                <td className="p-4">{row.Pegawai.KantorTujuan.kantor}</td>
                <td>
                  <div className="tooltip" data-tip="Detail">
                    <Link href={`/mutasi/sdm/permohonan-pembayaran/${row.id}`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="FolderOpen"
                          height={16}
                        />
                      </div>
                    </Link>
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
