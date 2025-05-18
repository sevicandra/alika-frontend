"use client";
import React from "react";
import { useEffect } from "react";
import { useSession } from "@/lib/context/session";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthenticated");
      window.location.href = "/api/auth/signin";
    }
  }, [status]);
  return <>{children}</>;
}
