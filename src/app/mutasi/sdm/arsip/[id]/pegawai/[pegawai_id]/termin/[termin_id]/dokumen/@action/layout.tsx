"use client";
import { useRouter } from "next/navigation";  


export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    return <div onClick={() => router.back()} className="fixed inset-0 z-50 backdrop-blur-lg p-4 flex overflow-auto">{children}</div>;
}
