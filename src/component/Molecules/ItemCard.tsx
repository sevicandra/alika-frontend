// components/molecules/ItemCard.tsx
import Card from "@/component/Atoms/Card";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  status?: React.ReactNode;
  className?: string;
}

export default function ItemCard({
  title,
  subtitle,
  children,
  status,
  className,
}: ItemCardProps) {
  return (
    <Card className={cn("hover:bg-base-200", className)}>
      <div className="flex justify-between items-start px-4 pt-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          {subtitle && (
            <div className="text-sm text-base-content/60">{subtitle}</div>
          )}
        </div>
        {status && <div >{status}</div>}
      </div>
      <div className="mt-2 pb-4 text-sm">{children}</div>
    </Card>
  );
}
