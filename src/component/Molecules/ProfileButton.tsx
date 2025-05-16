import Avatar from "../Atoms/Avatar";
import { FaAngleDown } from "react-icons/fa6";

const ProfileButton = ({
  src,
  name,
  nip,
  ref,
}: {
  src?: string;
  name: string;
  nip: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={ref}
      className="border-secondary bg-neutral/80 hover:bg-neutral flex max-w-3xs min-w-fit cursor-pointer items-center gap-2 overflow-x-hidden rounded-full border p-1 hover:drop-shadow sm:pr-3"
    >
      {src && <Avatar src={src} />}
      <div className="text-primary-content hidden truncate text-left text-nowrap sm:block">
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs">{nip}</p>
      </div>
      <div className="text-primary-content hidden sm:block">
        <FaAngleDown />
      </div>
    </div>
  );
};

export default ProfileButton;
