"use client";
import { useRef, useState, useEffect } from "react";
function SliderButton({
  tabs,
}: {
  tabs: {
    name: string;
    active: boolean;
    action: () => void;
  }[];
}) {
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slider, setSlider] = useState<{
    height: number;
    width: number;
    top: number;
    left: number;
  }>();

  const setButtonRef = (tab: string, el: HTMLDivElement | null) => {
    if (el) {
      buttonRefs.current.set(tab, el);
    }
  };

  useEffect(() => {
    const activeTab = tabs.find((item) => item.active === true);
    const button = activeTab ? buttonRefs.current.get(activeTab.name) : undefined;
    if (button) {
      const timer = setTimeout(() => {
        setSlider({
          height: button.offsetHeight,
          width: button.offsetWidth,
          top: button.offsetTop,
          left: button.offsetLeft,
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [tabs]);

  return (
    <span className="relative flex gap-2 rounded-box bg-accent p-1">
      <div
        className="absolute z-1 rounded-box bg-primary/80 transition-all duration-700"
        style={{
          height: slider?.height,
          width: slider?.width,
          top: slider?.top,
          left: slider?.left,
        }}
      ></div>
      {tabs?.map((item) => (
        <div
          key={item.name}
          className="z-2 cursor-pointer rounded-box px-2 text-xs text-neutral-content"
          ref={(el) => setButtonRef(item.name, el)}
          onClick={() => {
            item.action();
          }}
        >
          {item.name}
        </div>
      ))}
    </span>
  );
}

export default SliderButton;
