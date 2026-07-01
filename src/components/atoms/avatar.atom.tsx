"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  fallbackText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "squircle" | "rounded";
  isRing?: boolean;
  ringColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
};

const Avatar = ({
  className,
  src,
  alt = "User Avatar",
  fallbackText,
  size = "md",
  shape = "circle",
  isRing = false,
  ringColor,
  ...props
}: AvatarProps) => {
  // Map friendly size labels to DaisyUI / Tailwind width classes
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const shapeClasses = {
    circle: "rounded-full",
    squircle: "mask mask-squircle",
    rounded: "rounded-xl",
  };

  return (
    <div
      className={cn("avatar", fallbackText && !src && "placeholder", className)}
      {...props}
    >
      <div
        className={cn(
          sizeClasses[size],
          shapeClasses[shape],
          isRing && "ring ring-offset-2",
          ringColor === "primary" && "ring-primary",
          ringColor === "secondary" && "ring-secondary",
          ringColor === "accent" && "ring-accent",
          ringColor === "neutral" && "ring-neutral",
          ringColor === "info" && "ring-info",
          ringColor === "success" && "ring-success",
          ringColor === "warning" && "ring-warning",
          ringColor === "error" && "ring-error",
        )}
      >
        {src ? (
          // Using unoptimized or standard img if absolute URL, else Next Image is great
          src.startsWith("http") || src.startsWith("data:") ? (
            <img src={src} alt={alt} className="object-cover" />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={96}
              height={96}
              className="object-cover"
            />
          )
        ) : fallbackText ? (
          <span className="flex h-full w-full items-center justify-center bg-neutral text-xs font-bold text-neutral-content uppercase">
            {fallbackText.slice(0, 2)}
          </span>
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-neutral text-neutral-content">
            <svg
              className="h-1/2 w-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
