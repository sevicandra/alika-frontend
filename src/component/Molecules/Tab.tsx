'use client';
import { useRef, useState, useEffect } from "react";
function Tab({
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
    const button = activeTab
      ? buttonRefs.current.get(activeTab.name)
      : undefined;
    if (button) {
      setSlider({
        height: button.offsetHeight,
        width: button.offsetWidth,
        top: button.offsetTop,
        left: button.offsetLeft,
      });
    }
  }, [tabs]);

  return (
    <span className="rounded-box bg-accent flex gap-2 p-1 relative">
      <div
        className="absolute z-1 bg-primary/80 rounded-box transition-all duration-700"
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
          className="rounded-box px-2 z-2 cursor-pointer text-xs text-neutral-content"
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

export default Tab;
