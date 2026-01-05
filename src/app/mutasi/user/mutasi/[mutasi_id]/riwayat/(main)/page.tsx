"use client";
import { useState, useEffect, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";
import Link from "next/link";
import { snackToUpperCase } from "@/helpers/string.helper";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ItemCard from "@/component/Molecules/ItemCard";
import ExpandableItemCard from "@/component/Molecules/ExpandableItemCard";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { mutasi_id } = use(params);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const [data, setData] = useState<
    {
      id: string;
      pegawai_id: string;
      actor_nip: string | null;
      actor_role: string;
      action: string;
      description: string | null;
      created_at: Date;
      action_type: "GENERAL_ACTION" | "SANGGAHAN_DIAJUKAN" | "SANGGAHAN_DIREVIEW";
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/History`, {
          method: "GET",
        });

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }

        const { data } = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, [addNotification, mutasi_id]);

  return (
    <ContainerCard
      title="Daftar SK Mutasi"
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative grid grid-rows-[1fr_auto] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/20 p-4">
            <Loading />
          </div>
        )}
        <div className="overflow-y-auto py-2">
          {data.map((item) => (
            <span key={item.id}>
              {!item.description ? (
                <ItemCard
                  title={item.action}
                  subtitle={new Date(item.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  status={
                    <span className="badge badge-sm text-nowrap badge-info">
                      {snackToUpperCase(item.actor_role)}
                    </span>
                  }
                >
                  {item.action_type !== "GENERAL_ACTION" && (
                    <div className="max-w-full px-4">
                      <div
                        className="flex min-w-max flex-nowrap justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="tooltip" data-tip="payload">
                          <Link
                            href={`/mutasi/user/mutasi/${mutasi_id}/riwayat/${item.id}/payload`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon className="hover:scale-110" icon="Eye" height={16} />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </ItemCard>
              ) : (
                <ExpandableItemCard
                  title={item.action}
                  subtitle={new Date(item.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  status={
                    <span className="badge badge-sm text-nowrap badge-info">
                      {snackToUpperCase(item.actor_role)}
                    </span>
                  }
                  detail={item.description}
                >
                  {item.action_type !== "GENERAL_ACTION" && (
                    <div className="max-w-full px-4">
                      <div
                        className="flex min-w-max flex-nowrap justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="tooltip" data-tip="payload">
                          <Link
                            href={`/mutasi/user/mutasi/${mutasi_id}/riwayat/${item.id}/payload`}
                          >
                            <div className="rounded-box bg-info/80 p-1 text-info-content">
                              <Icon className="hover:scale-110" icon="Eye" height={16} />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </ExpandableItemCard>
              )}
            </span>
          ))}
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
