"use client";

import { cn } from "@/lib/utils";

type LogoProps = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
};

const Logo = ({ width = 40, height = 40, className, ...props }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 220 236"
      className={cn("h-auto", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M159.47 235.084C178.291 235.084 193.687 219.688 193.687 200.866V7.92157H175.568C147.893 7.92157 125.253 30.562 125.253 58.2374V120.624C135.933 120.624 144.59 129.284 144.59 139.962C144.59 150.642 135.933 159.299 125.253 159.299V200.866C125.253 219.688 140.652 235.084 159.47 235.084Z"
        className="fill-primary-800"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M193.69 7.92163H193.687C160.38 -9.60898 118.785 3.30027 101.255 36.6073L0.909058 227.26C34.2161 244.79 75.811 231.884 93.3416 198.574L115.424 156.618C109.734 153.254 105.915 147.053 105.915 139.962C105.915 129.284 114.572 120.624 125.253 120.624C128.172 120.624 130.937 121.274 133.418 122.431L193.69 7.92163Z"
        className="fill-primary-400"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M187.501 93.9148L179.329 89.6154L129.158 184.94C120.392 201.596 126.846 222.391 143.502 231.159C160.156 239.925 180.95 233.471 189.718 216.815L212.314 173.879C227.483 145.063 216.317 109.081 187.501 93.9148Z"
        className="fill-primary-400"
      />
      <circle
        cx={125.253}
        cy={139.962}
        r={16.23}
        className="fill-primary-900"
      />
    </svg>
  );
};

export default Logo;
