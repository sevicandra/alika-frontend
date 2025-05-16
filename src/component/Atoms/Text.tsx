// components/atoms/Text.tsx
import { cn } from "@/lib/utils";

type TextProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Text = ({ className, ...props }: TextProps) => (
  <p className={cn("text-sm text-primary-700", className)} {...props} />
);
