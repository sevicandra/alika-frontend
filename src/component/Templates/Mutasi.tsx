"use server";
import Sidebar from "@/component/Organisms/Sidebar";
import { OAuth2 } from "@/lib/OAuthOptions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await OAuth2.session();
  const role = user?.account.find(a => a.service.toUpperCase() === "MUTASI")?.roles.map(r => r.nama) || []
  return (
    <div className="relative grid grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar menu={"Mutasi"} role={role} />
      <div className={`h-full max-h-full w-[50px] md:hidden`}></div>
      <main className="relative overflow-hidden">{children}</main>
    </div>
  );
}
