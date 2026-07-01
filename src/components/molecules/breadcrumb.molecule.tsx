"use client";

import { cn } from "@/lib/utils";

type BreadcrumbProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
};

function Breadcrumb<T>({
  data,
  renderRow,
  className,
  ...props
}: BreadcrumbProps<T>) {
  return (
    <div
      className={cn("breadcrumbs text-sm text-base-content", className)}
      {...props}
    >
      <ul>{data.map((row, index) => renderRow(row, index))}</ul>
    </div>
  );
}

export default Breadcrumb;
