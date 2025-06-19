"use client";
import GroupButton from "@/component/Molecules/GroupButton";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalPage } = usePaginator();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-4">
      <div className="max-w-full overflow-x-auto px-4">
        <GroupButton
          className="btn-success"
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
      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
    </div>
  );
}
