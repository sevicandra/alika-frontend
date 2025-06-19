'use client';
import RincianProvider from "@/context/penghasilan/rincian";
import { useEffect } from "react";
import { useSession } from "@/context/session";
export default  function Layout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    useEffect(() => {
      if (status === "unauthenticated") {
        console.log("unauthenticated");
        window.location.href = "/api/auth/signin";
      }
    }, [status]);
  return (
    <RincianProvider>
      {children}
    </RincianProvider>
  );
}
