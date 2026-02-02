"use client";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-2 p-1">
      <Link href={"/mutasi/user/dashboard/estimasi"} className="w-full">
        <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
          Estimasi Biaya
        </button>
      </Link>
      <Link href={"/mutasi/user/dashboard/faq"} className="w-full">
        <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
          FAQ
        </button>
      </Link>
    </div>
  );
}
