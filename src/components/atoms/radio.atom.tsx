"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
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

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, variant, size = "md", disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        disabled={disabled}
        className={cn(
          "radio transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none",
          variant === "primary" && "radio-primary focus:ring-primary",
          variant === "secondary" && "radio-secondary focus:ring-secondary",
          variant === "accent" && "radio-accent focus:ring-accent",
          variant === "neutral" && "radio-neutral focus:ring-neutral",
          variant === "info" && "radio-info focus:ring-info",
          variant === "success" && "radio-success focus:ring-success",
          variant === "warning" && "radio-warning focus:ring-warning",
          variant === "error" && "radio-error focus:ring-error",
          size === "sm" && "radio-sm",
          size === "md" && "radio-md",
          size === "lg" && "radio-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

Radio.displayName = "Radio";

export default Radio;
