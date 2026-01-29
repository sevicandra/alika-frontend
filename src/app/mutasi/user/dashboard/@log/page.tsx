"use client";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";

export default function Page() {
  const { addNotification } = useNotification();
  const [data, setData] = useState<
    {
      id: string;
      pegawai_id: string;
      actor_role: string;
      action: string;
      description: string;
      created_at: string;
    }[]
  >([]);

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Mutasi/Pegawai/Dashboard/Log");
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Network response was not ok");
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
        addNotification({
          title: "Log Mutasi",
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  if (error) throw error;

  return (
    <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      <div className="overflow-y-auto py-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-1 gap-x-2 border-b border-base-300 px-2 py-1"
          >
            <div className="aspect-square w-8 rounded-full bg-accent"></div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold">{item.action}</p>
            </div>
            <div className="relative after:absolute after:top-0 after:left-1/2 after:h-full after:w-1 after:-translate-x-1/2 after:rounded after:bg-base-content/50 after:content-['']"></div>
            <div className="flex flex-col justify-center">
              <p className="text-xs text-base-content/60">
                {new Date(item.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                - {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
