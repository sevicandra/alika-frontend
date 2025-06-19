"use client";
import GroupButton from "@/component/Molecules/GroupButton";
import { Suspense } from "react";
import { RincianContext } from "@/context/penghasilan/rincian";
import { useContext, useState } from "react";
import Tab from "@/component/Molecules/SliderButton";
const Page = ({
  rutin,
  kekurangan,
}: {
  rutin: React.ReactNode;
  kekurangan: React.ReactNode;
}) => {
  const { tahun } = useContext(RincianContext);
  const [rutinTab, setRutinTab] = useState(true);
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div>Tunjangan Kinerja Tahun {tahun}</div>
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
          <Tab
            tabs={[
              {
                name: "Rutin",
                active: rutinTab,
                action: () => setRutinTab(true),
              },
              {
                name: "Kekurangan",
                active: !rutinTab,
                action: () => setRutinTab(false),
              },
            ]}
          />
        </div>
        <div className="overflow-auto">
          <Suspense>{rutinTab ? rutin : kekurangan}</Suspense>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
