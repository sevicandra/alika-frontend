"use server";
import GroupButton from "@/component/Molecules/GroupButton";
const Layout = async ({
  data,
  tahun,
}: {
  data: React.ReactElement;
  tahun: React.ReactElement;
}) => {
  return (
    <div className="grid h-full max-h-full grid-rows-[24_1fr] gap-2 overflow-hidden p-4">
      <div className="overflow-x-auto overflow-y-hidden">{tahun}</div>
      <div className="bg-base-200 rounded-box grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden p-2">
        <div className="overflow-x-auto overflow-y-hidden">
          <GroupButton
          className="btn-secondary border-0"
            button={[
              {
                name: "Gaji Pokok",
                type: "link",
                href: "/penghasilan/rincian/gaji-pokok",
              },
              {
                name: "Tukin",
                type: "link",
                href: "/penghasilan/rincian/tunjangan-kinerja",
              },
              {
                name: "Uang Makan",
                type: "link",
                href: "/penghasilan/rincian/uang-makan",
              },
              {
                name: "Uang Lembur",
                type: "link",
                href: "/penghasilan/rincian/uang-lembur",
              },
              {
                name: "Lain-Lain",
                type: "link",
                href: "/penghasilan/rincian/lain-lain",
              },
            ]}
          />
        </div>
        <div className="relative overflow-auto">{data}</div>
        <div></div>
      </div>
    </div>
  );
};

export default Layout;
