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
    <Card
      className={cn("hover:bg-base-200", className)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between px-4 pt-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          {subtitle && (
            <div className="text-muted-foreground text-sm">{subtitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status}
          {detail && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition"
            >
              {isOpen ? <LuChevronUp /> : <LuChevronDown />}
            </button>
          )}
        </div>
      </div>
      {isOpen && detail && (
        <div className="text-muted-foreground mt-2 px-4 pt-2 text-sm transition">
          {detail}
        </div>
      )}
      <div className="mt-2 pb-4 text-sm">{children}</div>
    </Card>
  );
}
