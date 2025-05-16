"use client";
import { Menu, MenuButton, MenuItems } from "@/component/Molecules/Dropdown";
import { useContext, useEffect, useState } from "react";
import { CetakDocContext } from "@/lib/context/penghasilan/cetakDoc";
import { NotificationContext } from "@/lib/context/notifikasi";
export default function Page() {
  const { tahun, setTahun } = useContext(CetakDocContext);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useContext(NotificationContext);
  const [data, setData] = useState<{ tahun: number }[]>([]);
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
    <Menu>
      <MenuButton>
        <div className="btn btn-xs btn-outline w-12 md:w-24">{tahun}</div>
      </MenuButton>
      <MenuItems className="bg-secondary flex flex-col gap-2">
        {data.map((item) => (
          <button
            key={item.tahun}
            className="cursor-pointer p-1"
            onClick={() => setTahun(item.tahun)}
          >
            <p className="p-1 text-xs truncate text-nowrap">{item.tahun}</p>
          </button>
        ))}
      </MenuItems>
    </Menu>
  );
}
