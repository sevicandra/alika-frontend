"use client";
import { useEffect } from "react";
import ContainerCard from "@/component/Molecules/ContainerCard";
import Loading from "@/component/Molecules/Loading";
import { useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { usePaginator } from "@/context/paginator";
import Link from "next/link";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";
import ItemCard from "@/component/Molecules/ItemCard";

export default function Page() {
  const { addNotification } = useNotification();
  const { refresh, searchsTerm, setSearchsTerm, searchs, filter, setFilter } =
    useTable();
  const { page: currentPage, limit, setTotalPage } = usePaginator();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      id: string;
      question: string;
      answer: string;
      status: "DRAFT" | "PUBLISH";
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());
        const { search } = searchs;
        const { status } = filter;
        if (search) searchParams.append("search", search);
        if (status) searchParams.append("status", status);
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/Admin/Referensi/Faq?${searchParams}`,
          {
            method: "GET",
          },
        );
        const { error, data, meta } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setData(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        addNotification({
          title: "Fetch Refernsi FAQ",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    currentPage,
    limit,
    refresh,
    searchs,
    filter,
    addNotification,
    setTotalPage,
  ]);

  return (
    <ContainerCard
      title="Daftar FAQ"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
      headerRight={
        <div className="flex gap-2">
          <input
            onChange={(e) =>
              setSearchsTerm({
                search: e.target.value,
              })
            }
            type="text"
            className="input-bordered input input-xs w-xs max-w-full focus:outline-none"
            placeholder=""
            value={searchsTerm.search || ""}
          />
          <select
            className="select-bordered select select-xs focus:outline-none"
            onChange={(e) =>
              setFilter({
                status: e.target.value,
              })
            }
            value={filter.status || ""}
          >
            <option value="">Semua Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISH">PUBLISH</option>
          </select>
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
          {data.map((row, index) => (
            <ItemCard title={row.question} subtitle={row.answer} key={index}>
              <div className="max-w-full px-4">
                <div
                  className="flex min-w-max justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.status === "DRAFT" ? (
                    <>
                      <div className="tooltip" data-tip="edit">
                        <Link
                          href={`/mutasi/admin/referensi/faq/${row.id}/edit`}
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
                          href={`/mutasi/admin/referensi/faq/${row.id}/hapus`}
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
                      <div className="tooltip" data-tip="publish">
                        <Link
                          href={`/mutasi/admin/referensi/faq/${row.id}/publish`}
                        >
                          <div className="rounded-box bg-success/80 p-1 text-success-content">
                            <Icon
                              className="hover:scale-110"
                              icon="CircleCheck"
                              height={16}
                            />
                          </div>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="tooltip" data-tip="draft">
                      <Link
                        href={`/mutasi/admin/referensi/faq/${row.id}/draft`}
                      >
                        <div className="rounded-box bg-warning/80 p-1 text-warning-content">
                          <Icon
                            className="hover:scale-110"
                            icon="CircleAlert"
                            height={16}
                          />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      </div>
    </ContainerCard>
  );
}
