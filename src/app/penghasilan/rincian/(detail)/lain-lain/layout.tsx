"use client";
import GroupButton from "@/component/Molecules/GroupButton";
import { Suspense } from "react";
import { RincianContext } from "@/lib/context/penghasilan/rincian";
import { useContext } from "react";
const Page = ({ children }: { children: React.ReactNode }) => {
  const { tahun } = useContext(RincianContext);
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div>Penghasilan Lain Tahun {tahun}</div>
      <div className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-2">
        <div className="flex w-full justify-between">
          <GroupButton
            className="btn-secondary border-0"
            button={[
              {
                name: "Kembali",
                type: "link",
                href: "/penghasilan/rincian",
              },
            ]}
          />
        </div>
        <div className="overflow-auto">
          <Suspense>{children}</Suspense>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
