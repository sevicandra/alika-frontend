'use client';
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { useEffect } from "react";
import { useSession } from "@/lib/context/session";

export default function Layout({ data }: { data: React.ReactNode }) {
    const { status } = useSession();
    useEffect(() => {
      if (status === "unauthenticated") {
        console.log("unauthenticated");
        window.location.href = "/api/auth/signin";
      }
    }, [status]);
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
