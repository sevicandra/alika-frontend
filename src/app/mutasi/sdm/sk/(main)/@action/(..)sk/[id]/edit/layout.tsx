"use client";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative m-auto w-full max-w-md border-base-content/20 border bg-base-200 text-bse-content rounded-box p-2 shadow-base-content/10 shadow-md"
    >
      {children}
    </div>
  );
}
