import Icon from "../Atoms/LabelIcon";
import Link from "next/link";

type props = {
  title: string;
  icon: string;
  description: string;
  href?: string;
  actionText?: string;
};

export default function Card({ title, icon, description, href, actionText = "Buka" }: props) {
  return (
    <div className="grid grid-rows-[1fr_auto] overflow-clip rounded-lg bg-base-100 shadow hover:-translate-y-1 hover:shadow-lg">
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] items-center gap-2 p-4">
        <div className="rounded-lg bg-info-200 p-2">
          <Icon icon={icon} className="text-info-700" height={20} />
        </div>
        <div className="uppercase">{title}</div>
        <div className="col-span-2">{description}</div>
      </div>
      <div className="bg-base-200 px-4 py-2">
        <div className="flex justify-end">
          {href && (
            <Link href={href} className="hover:text-accent hover:underline">
              {actionText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
