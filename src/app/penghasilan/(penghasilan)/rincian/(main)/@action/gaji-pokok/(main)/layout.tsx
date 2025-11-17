"use client";
import { Suspense } from "react";
import { useState } from "react";
import Tab from "@/component/Molecules/SliderButton";
const Page = ({
  rutin,
  kekurangan,
}: {
  rutin: React.ReactNode;
  kekurangan: React.ReactNode;
}) => {
  const [rutinTab, setRutinTab] = useState(true);
  return (
    <div className="grid h-full max-h-full gap-2 overflow-hidden p-2">
      <div className="relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden rounded-box bg-base-200">
        <div className="flex w-full justify-end px-4">
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
