"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  isFullWidth?: boolean;
  options?: SelectOption[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size = "md",
      isFullWidth = true,
      options,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          "select-bordered select transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:outline-none",
          isFullWidth && "w-full",
          variant === "primary" && "select-primary focus:ring-primary",
          variant === "secondary" && "select-secondary focus:ring-secondary",
          variant === "accent" && "select-accent focus:ring-accent",
          variant === "neutral" && "select-neutral focus:ring-neutral",
          variant === "info" && "select-info focus:ring-info",
          variant === "success" && "select-success focus:ring-success",
          variant === "warning" && "select-warning focus:ring-warning",
          variant === "error" && "select-error focus:ring-error",
          size === "sm" && "select-sm",
          size === "md" && "select-md",
          size === "lg" && "select-lg",
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;
