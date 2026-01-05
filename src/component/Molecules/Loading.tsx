import { LuLoader } from "react-icons/lu";
export default function Loading({
  direction = "vertical",
}: {
  direction?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={`flex max-h-full ${direction === "vertical" ? "mx-auto my-auto flex-col" : "flex-row px-1"} items-center gap-1 overflow-hidden`}
    >
      <LuLoader
        className={`animate-spin ${direction === "vertical" ? "h-12 w-12" : "max-h-full"}`}
      />
      <p className="animate-pulse text-lg font-medium">Sedang memuat konten...</p>
    </div>
  );
}
