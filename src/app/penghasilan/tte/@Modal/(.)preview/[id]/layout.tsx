"use client";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden p-2 shadow-sm backdrop-blur-xs md:p-8"
    >
      {children}
    </div>
  );
}
