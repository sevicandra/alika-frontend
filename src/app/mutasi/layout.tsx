import Template from "@/component/Templates/Mutasi";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mutasi",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <Template>{children}</Template>;
}
