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
    <div className="not-last:after:border-base-200 not-last:after:m-2 not-last:after:block not-last:after:border-2 not-last:after:border-t not-last:after:content-['']">
      {title && isOpen && (
        <div className="text-primary-content p-2">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default SidebarItems;
