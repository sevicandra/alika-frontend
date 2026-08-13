"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      const newPath = "/" + segments.slice(0, -1).join("/");
      router.replace(newPath);
    }
  }, [router, pathname]);

  return null;
}
