"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { useSanggah } from "@/context/mutasi/sdm";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Loading from "@/component/Molecules/Loading";
import ContainerCard from "@/component/Molecules/ContainerCard";
import { DataTable } from "@/component/Organisms/DataTable";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { refresh, search, searchTerm, setSearchTerm } = useSanggah();

  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [data, setData] = useState<
    {
      id: string;
      ticket_number: string;
      pegawai_id: string;
      submitted_at: string;
      Pegawai: {
        nama: string;
        nip: string;
        SuratKeputusan: {
          nomor: string;
          tanggal: string;
        };
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
        const res = await fetch(`/api/Mutasi/SDM/Sanggah?${searchParams}`, {
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
        console.log(error);
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
      title="Daftar Pengajuan Sanggah"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-bordered input input-xs w-xs focus:outline-none"
            placeholder="Cari berdasarkan Nomor Tiket/Nama"
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
              "Nomor Tiket",
              "Tanggal",
              "Nama/NIP",
              "Nomor SK",
              "Action",
            ]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.ticket_number}</td>
                <td className="p-4">
                  {new Date(row.submitted_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  {row.Pegawai.nama}/{row.Pegawai.nip}
                </td>
                <td className="p-4">{row.Pegawai.SuratKeputusan.nomor}</td>
                <td className="p-4">
                  <div className="tooltip" data-tip="Detail">
                    <Link href={`/mutasi/sdm/sanggah/${row.id}`}>
                      <div className="rounded-box bg-info/80 p-1 text-info-content">
                        <Icon
                          className="hover:scale-110"
                          icon="Eye"
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
