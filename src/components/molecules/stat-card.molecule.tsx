"use client";

import Card from "@/components/atoms/card.atom";
import Text from "@/components/atoms/text.atom";
import Spinner from "@/components/atoms/spinner.atom";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  loading?: boolean;
};

const StatCard = ({
  title,
  value,
  icon,
  description,
  className,
  loading = false,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-200/50 backdrop-blur-xs">
          <Spinner variant="primary" size="md" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Text
            as="span"
            variant="caption"
            className="font-semibold tracking-wider text-base-content/60 uppercase"
          >
            {title}
          </Text>
          <Text as="div" variant="h3" className="font-bold tracking-tight">
            {value}
          </Text>
          {description && (
            <Text as="p" variant="small" className="mt-1 text-base-content/50">
              {description}
            </Text>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 text-3xl text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
