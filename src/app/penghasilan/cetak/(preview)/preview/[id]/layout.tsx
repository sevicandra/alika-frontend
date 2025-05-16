import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

export default async function Layout({ data }: { data: React.ReactNode }) {
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-2 p-2 md:p-4">
      <div className="flex flex-wrap gap-1">
        <Link href="/penghasilan/cetak" className="btn btn-sm btn-ghost">
          <FiChevronLeft className="text-sm" />
          <p className="hidden md:block">Kembali</p>
        </Link>
      </div>
      <div className="overflow-hidden">
        <div className="bg-primary text-primary-content rounded-box relative grid h-full w-full grid-rows-[auto_1fr] gap-2 overflow-hidden">
          {data}
        </div>
      </div>
    </div>
  );
}
