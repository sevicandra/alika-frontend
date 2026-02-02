"use client";
import { cn } from "@/lib/utils";
import Icon from "@/component/Atoms/LabelIcon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePopUp } from "@/context/popup.context";

type PopUpProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export default function PopUp({
  title,
  children,
  className,
  ...props
}: PopUpProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);
  const { backdropRef } = usePopUp();
  return (
    <div
      className={cn(
        "m-auto grid h-fit max-h-full max-w-full grid-rows-[auto_1fr] overflow-hidden rounded-box border border-base-content/20 bg-base-200 shadow shadow-base-content/10",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
      ref={backdropRef}
    >
      <div className="flex items-center justify-between bg-primary p-2 text-primary-content">
        <div className="w-8" />
        <h3 className="text-lg font-semibold uppercase">{title}</h3>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-square rounded-full btn-ghost transition-all duration-300 btn-sm hover:scale-110 hover:rotate-90 hover:btn-error"
          aria-label="Tutup"
        >
          <Icon icon="x" height={"20px"} />
        </button>
      </div>
      <div className="relative overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
