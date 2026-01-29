import Template from "@/component/Templates/Penghasilan";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Penghasilan",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Template>{children}</Template>;
}
