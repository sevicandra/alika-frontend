"use client";
import { DataTable } from "@/component/Organisms/DataTable";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import { snackToTitleCase } from "@/helpers/string.helper";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ItemCard from "@/component/Molecules/ItemCard";
import ExpandableItemCard from "@/component/Molecules/ExpandableItemCard";
export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = use(params);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    {
      id: string;
      ticket_number: string;
      pegawai_id: string;
      status: "DRAFT" | "PENDING" | "REVIEWED";
      admin_notes?: string;
      submitted_at: Date;
      reviewed_at?: Date;
      DataSanggah: {
        sanggah_id: string;
        action: "EDIT" | "REMOVE" | "ADD";
        keluarga_id: string;
        new_value: JSON;
        reason: string;
        is_approved: boolean;
      }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah`,
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const data = (await res.json()).data;
        setData(data);
      } catch (error) {
        addNotification({
          title: "Data Keluarga",
          message: (error as Error).message,
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) throw error;

  return (
    <ContainerCard
      title="Riwayat Sanggah"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden max-h-full"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          {data.map((item, index) => (
            <ExpandableItemCard
              key={index}
              title={item.ticket_number}
              subtitle={
                <div className="flex flex-col">
                  <span>
                    {new Date(item.submitted_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              }
              status={
                <span className="badge badge-sm text-nowrap badge-info">
                  {snackToTitleCase(item.status)}
                </span>
              }
              detail={item.DataSanggah.map((item, index) => (
                <ul key={index}>
                  <p>
                    {index + 1}. {item.action}
                  </p>
                  {item.new_value && (
                    <p>
                      New Value:{" "}
                      <span className="text-sm font-semibold">
                        {JSON.stringify(item.new_value)}
                      </span>
                    </p>
                  )}
                </ul>
              ))}
            >
              <div className="px-4">
                {item.reviewed_at && (
                  <p>
                    <span className="text-sm font-semibold">Admin Notes:</span>{" "}
                    [
                    {new Date(item.reviewed_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    ]{item.admin_notes}
                  </p>
                )}
              </div>
            </ExpandableItemCard>
          ))}
        </div>
      </div>
    </ContainerCard>
  );
}
