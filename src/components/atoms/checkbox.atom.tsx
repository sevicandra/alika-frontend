"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
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
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant, size = "md", disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={cn(
          "checkbox transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none",
          variant === "primary" && "checkbox-primary focus:ring-primary",
          variant === "secondary" && "checkbox-secondary focus:ring-secondary",
          variant === "accent" && "checkbox-accent focus:ring-accent",
          variant === "neutral" && "checkbox-neutral focus:ring-neutral",
          variant === "info" && "checkbox-info focus:ring-info",
          variant === "success" && "checkbox-success focus:ring-success",
          variant === "warning" && "checkbox-warning focus:ring-warning",
          variant === "error" && "checkbox-error focus:ring-error",
          size === "sm" && "checkbox-sm",
          size === "md" && "checkbox-md",
          size === "lg" && "checkbox-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
