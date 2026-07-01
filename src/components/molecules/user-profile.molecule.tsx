import Avatar from "@/components/atoms/avatar.atom";
import { FaAngleDown } from "react-icons/fa6";

export default function UserProfile({
  src,
  name,
  nip,
  ref,
}: {
  src?: string;
  name: string;
  nip: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={ref}
      className="flex max-w-3xs min-w-fit cursor-pointer items-center gap-2 overflow-x-hidden rounded-full border border-primary-content bg-primary/80 p-1 shadow-primary/50 hover:bg-primary hover:shadow sm:pr-3"
    >
      {src && <Avatar src={src} />}
      <div className="hidden truncate text-left text-nowrap text-primary-content sm:block">
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs">{nip}</p>
      </div>
      <div className="hidden text-primary-content sm:block">
        <FaAngleDown />
      </div>
    </div>
  );
}
