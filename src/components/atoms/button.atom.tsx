"use client";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
};

const Button = ({
  className,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "btn inline-flex items-center justify-center border-0",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "ghost" && "btn-ghost",
        variant === "info" && "btn-info",
        variant === "success" && "btn-success",
        variant === "warning" && "btn-warning",
        variant === "error" && "btn-error",
        variant === "accent" && "btn-accent",
        variant === "neutral" && "btn-neutral",
        size === "sm" && "btn-sm",
        size === "md" && "btn-md",
        size === "lg" && "btn-lg",
        className,
      )}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
