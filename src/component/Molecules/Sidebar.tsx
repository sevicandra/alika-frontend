"use client";
import SidebarShell from "@/component/Organisms/SidebarShell";
import Icon from "../Atoms/LabelIcon";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/component/Organisms/SidebarShell";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ────────────────────────────────────────────────────────────
// SIDEBAR ITEM — Molecule
// Dipindahkan ke Molecules karena:
//   - Mengonsumsi SidebarContext dari Organism
//   - Memiliki routing hook (usePathname)
//   - Memiliki animasi delay state (useEffect, setTimeout)
// ────────────────────────────────────────────────────────────
export function SidebarItem({
  children,
  icon,
  href,
}: {
  children: React.ReactNode;
  icon?: string;
  href: string;
}) {
  const { isOpen } = useContext(SidebarContext);
  const [isOpenDelay, setIsOpenDelay] = useState(isOpen);
  const pathname = usePathname();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!isOpen) {
      timer = setTimeout(() => {
        setIsOpenDelay(isOpen);
      }, 500);
    } else {
      timer = setTimeout(() => {
        setIsOpenDelay(isOpen);
      }, 0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <Link href={href} className="w-full overflow-x-hidden">
      <div
        className={`grid grid-cols-[50_auto] ${isOpenDelay ? "justify-start" : "justify-center"} rounded-lg py-2 ${pathname.startsWith(href) ? "bg-base-100 text-base-content" : "text-base-content"} hover:bg-base-100`}
      >
        <span>
          <Icon height={"28px"} icon={icon} />
        </span>
        {isOpenDelay && (
          <span className="truncate pl-2 text-left text-lg font-bold text-nowrap">
            {children}
          </span>
        )}
      </div>
    </Link>
  );
}

// ────────────────────────────────────────────────────────────
// SIDEBAR ITEMS — Molecule
// Dipindahkan ke Molecules karena mengonsumsi SidebarContext.
// ────────────────────────────────────────────────────────────
export function SidebarItems({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { isOpen } = useContext(SidebarContext);
  return (
    <div className="not-last:after:m-2 not-last:after:block not-last:after:border-2 not-last:after:border-t not-last:after:border-base-200 not-last:after:content-['']">
      {title && isOpen && (
        <div className="p-2 text-base-content">
          <h2 className="text-xl font-semibold text-nowrap">{title}</h2>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export const Menu = SidebarShell;
export const Items = SidebarItems;
export const Item = SidebarItem;

const SidebarCompound = {
  Menu,
  Items,
  Item,
};

export default SidebarCompound;
