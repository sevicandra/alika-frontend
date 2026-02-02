import Card from "@/component/Atoms/Card";
import { cn } from "@/lib/utils";

interface ContainerCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  loading?: boolean;
}

export default function ContainerCard({
  title,
  children,
  className,
  headerRight,
}: ContainerCardProps) {
  return (
    <Card className={cn(className)}>
      {(title || headerRight) && (
        <div className="relative flex flex-wrap items-center justify-between gap-1 overflow-x-hidden p-4 py-2 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-base-100 after:content-[''] lg:flex-nowrap">
          {title && (
            <h2 className="shrink-0 text-lg font-semibold">
              {title.toLocaleUpperCase()}
            </h2>
          )}
          {headerRight}
        </div>
      )}
      {children}
    </Card>
  );
}
