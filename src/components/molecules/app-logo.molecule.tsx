"use client";

import Logo from "@/components/atoms/logo.atom";
import Text from "@/components/atoms/text.atom";
import { cn } from "@/lib/utils";

type AppLogoProps = React.HTMLAttributes<HTMLDivElement> & {
  logoSize?: number;
  appName?: string;
};

const AppLogo = ({
  className,
  logoSize = 40,
  appName = "ALIKA",
  ...props
}: AppLogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-base-content drop-shadow-sm select-none",
        className,
      )}
      {...props}
    >
      <Logo width={logoSize} height={logoSize} />
      <Text
        as="h1"
        variant="h3"
        className="m-0 border-b-0 pb-0 font-bold tracking-wider"
      >
        {appName}
      </Text>
    </div>
  );
};

export default AppLogo;
