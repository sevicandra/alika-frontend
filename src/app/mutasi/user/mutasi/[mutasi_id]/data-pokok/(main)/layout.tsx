"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { useMutasiDetail } from "@/context/mutasi/user";
import { Tabs, Item } from "@/component/Molecules/Tabs";

export default function Layout({
  dataPokok,

  sanggah,
  action,
}: {
  dataPokok: React.ReactNode;
  action: React.ReactNode;
  sanggah: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { data: mutasi } = useMutasiDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr] gap-2 overflow-hidden">
      <div className="mx-4 mt-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "mutasi") {
              return {
                name: mutasi ? mutasi.SuratKeputusan.nomor : "Surat Keputusan",
              };
            }
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/mutasi/user/${pathSegments.slice(0, index + 1).join("/")}`,
            };
          })}
          renderRow={(row, index) => (
            <li key={index}>
              {row.href ? (
                <Link href={row.href}>{row.name}</Link>
              ) : (
                <span>{row.name}</span>
              )}
            </li>
          )}
        />
      </div>
      <Tabs
        tabs={["Data Pokok", "Riwayat Sanggah"]}
        data={[dataPokok, sanggah]}
        renderTab={(item, index) => {
          return (
            <Item key={index} index={index} className="h-full overflow-hidden">
              {item}
            </Item>
          );
        }}
      />
      {action}
    </div>
  );
}
