"use client";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  isOutline?: boolean;
};

const Badge = ({
  children,
  className,
  variant,
  size = "md",
  isOutline = false,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "badge inline-flex items-center justify-center font-medium",
        isOutline && "badge-outline",
        variant === "primary" && "badge-primary",
        variant === "secondary" && "badge-secondary",
        variant === "accent" && "badge-accent",
        variant === "neutral" && "badge-neutral",
        variant === "info" && "badge-info",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        variant === "error" && "badge-error",
        variant === "ghost" && "badge-ghost",
        size === "xs" && "badge-xs",
        size === "sm" && "badge-sm",
        size === "md" && "badge-md",
        size === "lg" && "badge-lg",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
