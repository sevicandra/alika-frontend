"use client";
import { useContext } from "react";
import { SidebarContext } from "./SidebarMenu";

function SidebarItems({
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

export default SidebarItems;
