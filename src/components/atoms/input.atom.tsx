"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
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
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size = "md",
      isFullWidth = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "input-bordered input transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:outline-none",
          isFullWidth && "w-full",
          variant === "primary" && "input-primary focus:ring-primary",
          variant === "secondary" && "input-secondary focus:ring-secondary",
          variant === "accent" && "input-accent focus:ring-accent",
          variant === "neutral" && "input-neutral focus:ring-neutral",
          variant === "info" && "input-info focus:ring-info",
          variant === "success" && "input-success focus:ring-success",
          variant === "warning" && "input-warning focus:ring-warning",
          variant === "error" && "input-error focus:ring-error",
          size === "sm" && "input-sm",
          size === "md" && "input-md",
          size === "lg" && "input-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
