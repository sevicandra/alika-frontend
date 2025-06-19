"use client";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePathname } from "next/navigation";
import { useSanggahDetail } from "@/context/mutasi/sdm";

export default function Layout({
  children,
  params,
  action,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
  action: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);

  const { data: sanggah } = useSanggahDetail();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden relative">
      <div className="mx-4 mt-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => {
            let label;
            if (pathSegments[index - 1] === "sanggah") {
              return {
                name: sanggah ? sanggah.ticket_number.toUpperCase() : "Sanggah",
              };
            }
            return {
              name: label || segment.replace(/-/g, " ").toUpperCase(),
              href: `/mutasi/sdm/${pathSegments.slice(0, index + 1).join("/")}`,
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
      <div className="max-w-full overflow-x-auto px-4"></div>
      {children}
      <div className="mx-4 mb-4 flex justify-between"></div>
      {action}
    </div>
  );
}
