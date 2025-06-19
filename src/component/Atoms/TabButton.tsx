"use client";
import { useRef, useState, useEffect } from "react";
import { useTab } from "./TabMenu";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export const TabButton = ({
  className,
  items,
}: DivProps & {
  items: string[];
}) => {
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const warperRef = useRef<HTMLDivElement>(null);
  const [slider, setSlider] = useState<{
    width: number;
    left: number;
  }>();
  const setButtonRef = (tab: string, el: HTMLDivElement | null) => {
    if (el) {
      buttonRefs.current.set(tab, el);
    }
  };
  const { tab, setTab } = useTab();
  const updatePosition = () => {
    const currentTab = items.find((item, index) => index === tab);
    const button = currentTab ? buttonRefs.current?.get(currentTab) : undefined;
    if (button) {
      setSlider({
        width: button.offsetWidth,
        left: button.offsetLeft,
      });
    }
  };

  useEffect(() => {
    updatePosition();
  }, [items, tab]);

  return (
    <div ref={warperRef} className="relative mx-4 w-full overflow-clip">
      <div
        className="absolute z-1 bg-accent/80 shadow-lg transition-all delay-0 duration-700"
        style={{
          height: 1,
          width: slider?.width,
          bottom: 0,
          left: slider?.left,
        }}
      ></div>
      <div className={`flex-start flex gap-2`}>
        {items?.map((item, index) => (
          <div
            key={index}
            className={`z-2 cursor-pointer px-2 py-1 text-center transition-all duration-700`}
            ref={(el) => setButtonRef(item, el)}
            onClick={() => {
              setTab(index);
            }}
          >
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SelectButton = ({
  className,
  options,
}: SelectProps & { options: string[] }) => {
  const { tab, setTab } = useTab();
  return (
    <div className={`w-full ${className}`}>
      <select
        className={`select-bordered select w-full`}
        defaultValue={tab}
        onChange={(e) => setTab(parseInt(e.target.value))}
      >
        {options.map((item, index) => (
          <option key={index} value={index}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
