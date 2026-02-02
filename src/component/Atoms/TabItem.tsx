"use client";
import { useTab } from "./TabMenu";
type DivProps = React.HTMLAttributes<HTMLDivElement>;
export const TabItem = ({
  children,
  index,
  className,
}: DivProps & {
  children: React.ReactNode;
  index: number;
}) => {
  const { tab } = useTab();
  return (
    tab === index && (
      <div className={`w-full transition-all ease-in-out ${className}`}>
        {children}
      </div>
    )
  );
};
