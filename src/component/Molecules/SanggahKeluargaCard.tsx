import React from "react";
import { cn } from "@/lib/utils";
import Card from "@/component/Atoms/Card";

interface SanggahKeluargaCard {
  className?: string;
  children?: React.ReactNode;
  action: React.ReactNode;
}

export default function SanggahKeluargaCard({
  className,
  children,
  action,
}: SanggahKeluargaCard) {
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-2 p-4 hover:bg-base-200 hover:shadow",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">{action}</div>
      </div>
      {children}
    </Card>
  );
}
