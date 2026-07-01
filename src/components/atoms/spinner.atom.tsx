"use client";

import { cn } from "@/lib/utils";

type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  type?: "spinner" | "ring" | "dots" | "bars";
  size?: "xs" | "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "base";
};

const Spinner = ({
  className,
  type = "spinner",
  size = "md",
  variant = "base",
  ...props
}: SpinnerProps) => {
  return (
    <span
      className={cn(
        "loading",
        type === "spinner" && "loading-spinner",
        type === "ring" && "loading-ring",
        type === "dots" && "loading-dots",
        type === "bars" && "loading-bars",
        size === "xs" && "loading-xs",
        size === "sm" && "loading-sm",
        size === "md" && "loading-md",
        size === "lg" && "loading-lg",
        variant === "primary" && "text-primary",
        variant === "secondary" && "text-secondary",
        variant === "accent" && "text-accent",
        variant === "neutral" && "text-neutral",
        variant === "info" && "text-info",
        variant === "success" && "text-success",
        variant === "warning" && "text-warning",
        variant === "error" && "text-error",
        variant === "base" && "text-base-content",
        className,
      )}
      {...props}
    />
  );
};

export default Spinner;
