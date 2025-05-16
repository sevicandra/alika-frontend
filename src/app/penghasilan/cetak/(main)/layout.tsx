import GroupButton from "@/component/Molecules/GroupButton";
import { Suspense } from "react";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div className="overflow-x-auto overflow-y-hidden">
        <GroupButton
          className="btn-accent btn-outline"
          button={[
            {
              name: "KP4",
              type: "link",
              href: "/penghasilan/cetak/kp4",
            },
            { name: "SKP", type: "link", href: "/penghasilan/cetak/skp" },
            {
              name: "Daftar Gaji",
              type: "link",
              href: "/penghasilan/cetak/daftar-gaji",
            },
            {
              name: "PPh Pasal 21",
              type: "link",
              href: "/penghasilan/cetak/1721-A2",
            },
            {
              name: "PPh Pasal 21 Final",
              type: "link",
              href: "/penghasilan/cetak/1721-VII",
            },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
