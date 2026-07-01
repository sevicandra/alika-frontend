"use client";

import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  icon?: React.ReactNode;
  showIcon?: boolean;
};

const Label = ({
  children,
  className,
  icon,
  showIcon = false,
  ...props
}: LabelProps) => {
  return (
    <label
      className={cn(
        "label inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-base-content",
        className,
      )}
      {...props}
    >
      {showIcon && icon && (
        <span className="flex items-center justify-center">{icon}</span>
      )}
      <span className="label-text">{children}</span>
    </label>
  );
};

export default Label;
