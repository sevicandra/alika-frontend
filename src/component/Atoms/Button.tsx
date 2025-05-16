'use client';
import { cn } from "@/lib/utils";
type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;
const Button = ({ className, ...props }: ButtonProps) => (
  <button className={cn("btn border-0", className)} {...props} />
);

export default Button;