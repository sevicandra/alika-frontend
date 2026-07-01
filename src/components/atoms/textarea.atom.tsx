"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
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

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, size = "md", isFullWidth = true, disabled, ...props },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "textarea-bordered textarea transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:outline-none",
          isFullWidth && "w-full",
          variant === "primary" && "textarea-primary focus:ring-primary",
          variant === "secondary" && "textarea-secondary focus:ring-secondary",
          variant === "accent" && "textarea-accent focus:ring-accent",
          variant === "neutral" && "textarea-neutral focus:ring-neutral",
          variant === "info" && "textarea-info focus:ring-info",
          variant === "success" && "textarea-success focus:ring-success",
          variant === "warning" && "textarea-warning focus:ring-warning",
          variant === "error" && "textarea-error focus:ring-error",
          size === "sm" && "textarea-sm",
          size === "md" && "textarea-md",
          size === "lg" && "textarea-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
