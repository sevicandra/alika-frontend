import { cn } from "@/lib/utils";
type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        className,
        "bg-base-300 rounded-box border border-base-300 shadow shadow-base-300"
      )}
      {...props}
    >
      {children}
    </div>
  );
}
