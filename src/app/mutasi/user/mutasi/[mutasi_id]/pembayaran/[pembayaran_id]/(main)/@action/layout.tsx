"use client";
import { useRouter } from "next/navigation";  

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    return <div onClick={() => router.back()} className="fixed inset-0 z-50 backdrop-blur-lg flex overflow-hidden p-4">{children}</div>;
}
