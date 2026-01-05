import { cn } from "@/lib/utils";
type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-box border border-base-300 bg-base-300 shadow shadow-base-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
