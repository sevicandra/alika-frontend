"use client";
import { useEffect, use } from "react";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Loading from "@/component/Molecules/Loading";
import { useState } from "react";
import { DataTable } from "@/component/Organisms/DataTable";
import { useNotification } from "@/context/notifikasi";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addNotification } = useNotification();
  const { refresh } = useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      id: string;
      service: string;
      scope: string;
      action: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());

        setLoading(true);
        const res = await fetch(`/api/Sso/Client/${id}/Scope?${searchParams}`, {
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
          title: "Error Fetch Data Scope",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, refresh, addNotification, setTotalPage, id]);

  return (
    <ContainerCard
      title="Scope URL"
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
            columns={["No.", "Scope", ""]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  {row.service}.{row.scope}.{row.action}
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <div className="tooltip" data-tip="edit">
                      <Link href={`/sso/client/${id}/scope/${row.id}/edit`}>
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
                      <Link href={`/sso/client/${id}/scope/${row.id}/hapus`}>
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
