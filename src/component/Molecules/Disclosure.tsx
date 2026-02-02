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
        className="cursor-pointer p-2 after:mt-2 after:block after:h-0 after:w-full after:border after:border-accent-600 after:content-['']"
      >
        {title}
      </div>
      <div
        className={`${open ? "h-0" : "h-fit"} w-full overflow-hidden rounded-md transition-all duration-700`}
      >
        <div className="h-fit p-2">{children}</div>
      </div>
    </div>
  );
};
