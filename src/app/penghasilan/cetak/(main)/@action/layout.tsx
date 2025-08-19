"use client";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="fixed inset-0 z-50 flex overflow-auto p-4 backdrop-blur-lg"
    >
      {children}
    </div>
  );
}
