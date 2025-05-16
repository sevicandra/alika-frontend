import Template from "@/component/Templates/Penghasilan";
import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Penghasilan",
  };
}
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Template>{children}</Template>;
}
