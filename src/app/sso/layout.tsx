import Template from "@/component/Templates/Sso";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SSO",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Template>{children}</Template>;
}
