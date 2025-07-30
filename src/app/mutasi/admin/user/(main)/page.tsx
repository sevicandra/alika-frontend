"use client";
import { useEffect } from "react";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Loading from "@/component/Molecules/Loading";
import { useState } from "react";
import { DataTable } from "@/component/Organisms/DataTable";
import { useNotification } from "@/context/notifikasi";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";

export default function Page() {
  const { addNotification } = useNotification();
  const { refresh, getSearchParams } = useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      id: string;
      nip: string;
      nama: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());
        if (getSearchParams("search"))
          searchParams.append("search", getSearchParams("search"));

        setLoading(true);
        const res = await fetch(`/api/Mutasi/Admin/User?${searchParams}`, {
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
          title: "Error Fetch Data User",
          message: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, refresh]);

  return (
    <ContainerCard
      title="Daftar User"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto">
          <DataTable
            columns={["No.", "NIP", "Nama", ""]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{row.nip}</td>
                <td className="p-4">{row.nama}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <div className="tooltip" data-tip="edit">
                      <Link href={`/mutasi/admin/user/${row.id}/edit`}>
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon
                            className="hover:scale-110"
                            icon="SquarePen"
                            height={16}
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="tooltip" data-tip="role">
                      <Link href={`/mutasi/admin/user/${row.id}/role`}>
                        <div className="rounded-box bg-info/80 p-1 text-info-content">
                          <Icon
                            className="hover:scale-110"
                            icon="Eye"
                            height={16}
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="tooltip" data-tip="hapus">
                      <Link href={`/mutasi/admin/user/${row.id}/hapus`}>
                        <div className="rounded-box bg-error/80 p-1 text-error-content">
                          <Icon
                            className="hover:scale-110"
                            icon="Trash2"
                            height={16}
                          />
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
