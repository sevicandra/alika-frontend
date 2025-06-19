"use client";
import { useContext } from "react";
import GroupButton from "@/component/Molecules/GroupButton";
import Loading from "@/component/Molecules/Loading";
import { CetakDocContext } from "@/context/penghasilan/cetakDoc";

export default function Layout({
  children,
  bulan,
  tahun,
}: {
  children: React.ReactNode;
  bulan: React.ReactNode;
  tahun: React.ReactNode;
}) {
  const { setOpen, loading } = useContext(CetakDocContext);
  return (
    <div className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-2">
      <div className="flex w-full justify-between gap-2">
        <div className="justify-left flex gap-1">
          <>{bulan}</>
          <>{tahun}</>
        </div>
        <GroupButton
          className="btn-secondary"
          button={[
            {
              name: "Kirim Permohonan",
              type: "button",
              onClick: () => setOpen(true),
            },
          ]}
        />
      </div>
      {loading && (
        <div className="bg-base-300/50 text-primary-600 absolute z-10 flex h-full w-full">
          <Loading />
        </div>
      )}
      <>{children}</>
      <div></div>
    </div>
  );
}
