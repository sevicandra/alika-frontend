import Card from "../Atoms/Card";
import { cn } from "@/lib/utils";
import Loading from "./Loading";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  className,
  loading = false,
}: StatCardProps) {
  return (
    <Card className={cn(className, "relative p-4")}>
      <div className="flex items-center justify-between">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center p-4 backdrop-blur-lg">
            <Loading />
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-base-content">{title}</div>
          <div className="text-3xl font-bold text-base-content">{value}</div>
          {description && (
            <div className="mt-1 text-xs text-base-content/60">
              {description}
            </div>
          )}
        </div>
        {icon && <div className="text-4xl text-primary">{icon}</div>}
      </div>
    </Card>
  );
}
