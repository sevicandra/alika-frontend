import Button from "@/component/Atoms/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
export type ButtonType = {
  name: string;
  type: "button";
  onClick?: () => void;
};

export type LinkType = {
  name: string;
  type: "link";
  href: string;
};

export type GroupButtonProps = {
  button: (ButtonType | LinkType)[];
};
type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

const GroupButton = ({
  button,
  className,
  ...props
}: GroupButtonProps & ButtonProps) => {
  return (
    <div className="flex gap-1">
      {button.map((item) =>
        item.type === "button" ? (
          <Button
            className={cn("btn btn-xs", className)}
            onClick={item.onClick}
            {...props}
            key={item.name}
          >
            {item.name}
          </Button>
        ) : (
          <Link
            href={item.href}
            className={cn("btn btn-xs", className)}
            key={item.name}
          >
            {item.name}
          </Link>
        ),
      )}
    </div>
  );
};
export default GroupButton;
