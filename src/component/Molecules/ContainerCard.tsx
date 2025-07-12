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
        <div className="relative p-4 flex flex-wrap lg:flex-nowrap overflow-x-hidden gap-1 justify-between items-center after:absolute after:content-[''] after:w-full after:h-px after:left-0 after:bottom-0 after:bg-base-100">
          {title && (
            <h2 className="text-lg font-semibold shrink-0">
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
