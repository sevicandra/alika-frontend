"use client";
import Icon from "./LabelIcon";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "./SidebarMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({
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
        className={`grid grid-cols-[50_auto] ${isOpenDelay ? "justify-start" : "justify-center"} py-2 ${pathname.startsWith(href) ? "bg-base-content text-base-300" : "text-base-content"} hover:bg-base-content hover:text-base-300`}
      >
        <span>
          <Icon height={"28px"} icon={icon} />
        </span>
        {isOpenDelay && (
          <span className="truncate pl-2 text-left text-lg font-bold text-nowrap">{children}</span>
        )}
      </div>
    </Link>
  );
}
