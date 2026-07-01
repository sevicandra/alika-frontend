"use client";

import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-box border border-base-300 bg-base-200 text-base-content shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
