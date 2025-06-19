// src/components/molecules/ModuleSelectCard.tsx
import Card from "@/component/Atoms/Card";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

interface ModuleSelectCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
}

export default function ModuleSelectCard({
  title,
  icon,
  href,
  className,
}: ModuleSelectCardProps) {
  return (
    <Link
      href={href}
      className={cn("hover:shadow-lg transition duration-200", className)}
    >
      <Card className="flex flex-col items-center justify-center gap-2 p-4 w-50 aspect-square text-center">
        <div className="text-4xl">{icon}</div>
        <div className="font-semibold text-sm">{title}</div>
      </Card>
    </Link>
  );
}
