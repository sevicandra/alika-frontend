"use server";
import Sidebar from "@/component/Organisms/Sidebar";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar menu={"Penghasilan"} />
      <div className={`h-full max-h-full w-[50px] md:hidden`}></div>
      <main className="overflow-hidden">{children}</main>
    </div>
  );
}
