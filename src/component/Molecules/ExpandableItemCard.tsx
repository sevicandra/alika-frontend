// src/components/molecules/ExpandableItemCard.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Card from "@/component/Atoms/Card";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

interface ExpandableItemCardProps {
  title: string;
  subtitle?: React.ReactNode;
  status?: React.ReactNode;
  children?: React.ReactNode; // konten yang selalu ditampilkan
  detail?: React.ReactNode; // konten yang muncul saat expand
  defaultOpen?: boolean;
  className?: string;
}

export default function ExpandableItemCard({
  title,
  subtitle,
  status,
  children,
  detail,
  defaultOpen = false,
  className,
}: ExpandableItemCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={cn("hover:bg-base-200", className)} onClick={() => setIsOpen(!isOpen)} >
      <div className="flex justify-between items-start px-4 pt-4">
        <div>
          <div className="font-semibold text-base">{title}</div>
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status}
          {detail && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              {isOpen ? <LuChevronUp /> : <LuChevronDown />}
            </button>
          )}
        </div>
      </div>
      {isOpen && detail && (
        <div className="mt-2 pt-2 text-sm text-muted-foreground transition px-4">
          {detail}
        </div>
      )}
      {children && <div className="mt-2 pb-4 text-sm">{children}</div>}
    </Card>
  );
}
