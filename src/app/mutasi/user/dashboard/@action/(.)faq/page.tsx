"use client";
import { useState, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { usePaginator } from "@/context/paginator";
import Loading from "@/component/Molecules/Loading";
import ItemCard from "@/component/Molecules/ItemCard";
import Paginator from "@/component/Organisms/Paginator";

export default function Page() {
  const [data, setData] = useState<
    {
      id: string;
      question: string;
      answer: string;
      status: "DRAFT" | "PUBLISH";
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { page: currentPage, limit, setTotalPage, totalPage } = usePaginator();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (offset) searchParams.append("offset", offset.toString());
        const res = await fetch(`/api/Mutasi/Pegawai/Dashboard/Faq?${searchParams}`, {
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
          title: "Fetch Refernsi FAQ",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, addNotification, setTotalPage]);
  return (
    <div className="relative grid max-h-full grid-rows-[1fr_auto] overflow-hidden">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      <div className="flex min-h-24 flex-col gap-2 overflow-y-auto p-2">
        {data.map((row, index) => (
          <ItemCard title={row.question} subtitle={row.answer} key={index} />
        ))}
      </div>
      <div className="mx-4 mb-4 flex justify-between">{totalPage && <Paginator />}</div>
    </div>
  );
}
