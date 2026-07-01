"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePopUp } from "@/context/popup.context";
import { LuX } from "react-icons/lu";
import { PopUpProvider } from "@/context/popup.context";

export type PopUpProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

function PopUp({ title, children, className, ...props }: PopUpProps) {
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
          <LuX className="h-5 w-5" />
        </button>
      </div>
      <div className="relative overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function PopUpComponent(props: PopUpProps) {
  return (
    <PopUpProvider>
      <PopUp {...props} />
    </PopUpProvider>
  );
}
