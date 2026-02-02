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
      className={cn("transition duration-200 hover:shadow-lg", className)}
    >
      <Card className="flex aspect-square w-50 flex-col items-center justify-center gap-2 border-primary-content bg-primary p-4 text-center text-primary-content">
        <div className="text-4xl">{icon}</div>
        <div className="text-sm font-semibold">{title}</div>
      </Card>
    </Link>
  );
}
