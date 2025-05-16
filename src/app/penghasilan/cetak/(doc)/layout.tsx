'use server';
import GroupButton from "@/component/Molecules/GroupButton";
import CetakDocProvider from "@/lib/context/penghasilan/cetakDoc";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div>
        <GroupButton
          button={[
            {
              name: "Kembali",
              type: "link",
              href: "/penghasilan/cetak",
            },
          ]}
        />
      </div>
      <CetakDocProvider>{children}</CetakDocProvider>
    </div>
  );
}
