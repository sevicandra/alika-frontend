// import { DataTable } from "@/component/Organisms/DataTable";
import GroupButton from "@/component/Molecules/GroupButton";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-2">
      <GroupButton
        button={[
          { name: "Gaji Pokok", type: "link", href: "/penghasilan/gaji-pokok" },
          { name: "Tukin", type: "link", href: "/penghasilan/tukin" },
          { name: "Uang Makan", type: "link", href: "/penghasilan/uang-makan" },
          {
            name: "Uang Lembur",
            type: "link",
            href: "/penghasilan/uang-lembur",
          },
          { name: "Lain-Lain", type: "link", href: "/penghasilan/lain-lain" },
        ]}
      />
      <div className="grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
        <div>content header</div>
        <div className="overflow-auto">{children}</div>
        <div>content footer</div>
      </div>
    </div>
  );
};

export default Content;
