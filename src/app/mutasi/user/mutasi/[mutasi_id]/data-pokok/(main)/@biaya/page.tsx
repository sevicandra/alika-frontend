"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { snackToTitleCase } from "@/helpers/string.helper";
import ContainerCard from "@/component/Molecules/ContainerCard";

export default function Page({ params }: { params: Promise<{ mutasi_id: string }> }) {
  const { mutasi_id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    {
      jenis: string;
      items: {
        id: string;
        volume: number;
        harga_satuan: number;
        jenis: string;
        sub_jenis: string;
        keterangan: string;
        urutan: number;
      }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Biaya`);
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();

        const groupedByJenis: {
          jenis: string;
          items: {
            id: string;
            volume: number;
            harga_satuan: number;
            jenis: string;
            sub_jenis: string;
            keterangan: string;
            urutan: number;
          }[];
        }[] = [];

        data.forEach(
          (item: {
            id: string;
            volume: number;
            harga_satuan: number;
            jenis: string;
            sub_jenis: string;
            keterangan: string;
            urutan: number;
          }) => {
            if (groupedByJenis.find((group) => group.jenis === item.jenis)) {
              groupedByJenis.find((group) => group.jenis === item.jenis)?.items.push(item);
            } else {
              groupedByJenis.push({
                jenis: item.jenis,
                items: [item],
              });
            }
          }
        );
        setData(groupedByJenis);
      } catch (error) {
        addNotification({
          title: "Data Biaya",
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, mutasi_id]);

  if (error) throw error;

  return (
    <ContainerCard className="mx-4 mt-2 grid grid-rows-[auto_1fr] overflow-x-hidden py-2">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      {data.map((item) => (
        <DataTable
          key={item.jenis}
          data={item.items}
          columns={[
            `${snackToTitleCase(item.jenis)}`,
            "Volume",
            "Harga Satuan",
            "Total",
            "Keterangan",
          ]}
          renderRow={(item, index) => (
            <tr key={index}>
              <td className="w-1/3 px-4 py-2">{item.sub_jenis}</td>
              <td className="w-1/18 px-4 py-2">{item.volume}</td>
              <td className="w-1/9 px-4 py-2">
                {item.harga_satuan.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="w-2/9 px-4 py-2">
                {(item.volume * item.harga_satuan).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="w-1/3 px-4 py-2">{item.keterangan}</td>
            </tr>
          )}
        />
      ))}
      <DataTable
        columns={["Total", "", "", "", ""]}
        data={[
          {
            jenis: "Total",
            items: data.reduce(
              (total, item) =>
                total +
                item.items.reduce((total, item) => total + item.volume * item.harga_satuan, 0),
              0
            ),
          },
        ]}
        renderRow={(item, index) => (
          <tr key={index}>
            <td className="w-1/3 px-4 py-2">{item.jenis}</td>
            <td className="w-1/18 px-4 py-2"></td>
            <td className="w-1/9 px-4 py-2"></td>
            <td className="w-2/9 px-4 py-2">
              {item.items.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </td>
            <td className="w-1/3 px-4 py-2"></td>
          </tr>
        )}
      />
    </ContainerCard>
  );
}
