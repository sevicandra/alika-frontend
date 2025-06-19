"use client";
import { useEffect, useState, useContext } from "react";
import { DashboardContext } from "@/context/penghasilan/dashboard";
import { NotificationContext } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const [data, setData] = useState<{ tahun: number }[]>();
  const [error, setError] = useState<Error | null>(null);
  const { tahun, setTahun } = useContext(DashboardContext);
  const { addNotification } = useContext(NotificationContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/Penghasilan/Gaji/Tahun", {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        if (res.ok) {
          const data = (await res.json()).data;
          data.sort((a: any, b: any) => {
            return b.tahun - a.tahun;
          });
          while (data[0].tahun != new Date().getFullYear()) {
            data.unshift({ tahun: `${Number(data[0].tahun) + 1}` });
          }
          setData(data);
        }
      } catch (error) {
        setError(error as Error);
        addNotification({
          message: (error as Error).message,
          title: `Tahun`,
        });
      }
    };
    fetchData();
  }, []);
  if (error) throw error;
  return (
    <div className="flex gap-2 h-[24px]">
      {!data ? (
        <Loading direction="horizontal" />
      ) : (
        data.map((item: any) => {
          return (
            <button
              onClick={() => setTahun(item.tahun)}
              key={item.tahun}
              className={`btn btn-secondary btn-outline btn-xs ${tahun == item.tahun ? "btn-active" : ""}`}
            >
              {item.tahun}
            </button>
          );
        })
      )}
    </div>
  );
};

export default Page;
