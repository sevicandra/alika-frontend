"use client";
import { useState } from "react";
type DivProps = React.HTMLAttributes<HTMLDivElement>;
export const Disclosure = ({
  children,
  title,
  ...props
}: DivProps & {
  children: React.ReactNode;
  title: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer p-2 after:content-[''] after:w-full after:h-0 after:block after:border-accent-600 after:border after:mt-2"
      >
        {title}
      </div>
      <div
        className={`${open ? "h-0" : "h-fit"} rounded-md w-full transition-all duration-700 overflow-hidden`}
      >
        <div className="p-2 h-fit">{children}</div>
      </div>
    </div>
  );
};
