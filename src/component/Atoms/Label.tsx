import Icon from "./LabelIcon";
type ButtonProps = React.HTMLAttributes<HTMLDivElement>;
export default function Label({
  children,
  className,
  icon,
  showIcon = false,
  showText = true,
  ...props
}: ButtonProps & {
  icon?: string;
  showIcon?: boolean;
  showText?: boolean;
}) {
  return (
    <div className={`align-center grid grid-cols-[50_auto] gap-2 py-2 ${className}`} {...props}>
      {showIcon && (
        <span>
          <Icon height={"25px"} icon={icon} />
        </span>
      )}
      {showText && <span className="truncate text-left text-nowrap">{children}</span>}
    </div>
  );
}
