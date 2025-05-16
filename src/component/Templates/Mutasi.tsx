import Sidebar from "@/component/Organisms/Sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar menu="Mutasi" />
      <main className="overflow-hidden">{children}</main>
    </div>
  );
}
