"use client";

import { cn } from "@/lib/utils";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "lead"
  | "caption"
  | "small";

type TextProps<T extends React.ElementType = "p"> = {
  as?: T;
  variant?: TypographyVariant;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "muted"
    | "success"
    | "warning"
    | "error"
    | "info";
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

const Text = <T extends React.ElementType = "p">({
  as,
  variant,
  color = "default",
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as || "p";

  // Match default typographic styles based on the component or explicit variant prop
  const variantStyles: Record<TypographyVariant, string> = {
    h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "text-3xl font-semibold tracking-tight border-b pb-2",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
    body: "text-sm leading-relaxed",
    lead: "text-lg font-medium text-base-content/80",
    caption: "text-xs text-base-content/60",
    small: "text-xs font-medium leading-none",
  };

  const defaultVariant = variant || (Component as unknown as TypographyVariant);
  const resolvedVariantStyle =
    variantStyles[defaultVariant] || variantStyles.body;

  const colorStyles = {
    default: "text-base-content",
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    neutral: "text-neutral-content",
    muted: "text-base-content/60",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
  };

  return (
    <Component
      className={cn(resolvedVariantStyle, colorStyles[color], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
