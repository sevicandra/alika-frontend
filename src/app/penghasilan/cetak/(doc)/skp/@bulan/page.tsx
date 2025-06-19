"use client";
import { Menu, MenuButton, MenuItems } from "@/component/Molecules/Dropdown";
import { useContext } from "react";
import { CetakDocContext } from "@/context/penghasilan/cetakDoc";
const bulans = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export default function Page() {
  const { bulan, setBulan } = useContext(CetakDocContext);
  return (
    <Menu>
      <MenuButton>
        <div className="btn btn-xs btn-outline w-12 md:w-24">
          {bulans[bulan - 1]}
        </div>
      </MenuButton>
      <MenuItems className="bg-secondary flex flex-col gap-2">
        {bulans.map((item) => (
          <button
            key={item}
            className="cursor-pointer p-1"
            onClick={() => setBulan(bulans.indexOf(item) + 1)}
          >
            <p className="p-1 text-xs truncate text-nowrap w-full overflow-hidden">{item}</p>
          </button>
        ))}
      </MenuItems>
    </Menu>
  );
}
