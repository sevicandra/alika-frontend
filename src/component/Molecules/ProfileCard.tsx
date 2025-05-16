"use client";
import { useState } from "react";
import Icon from "../Atoms/Icon";
export default function ProfileCard() {
  const [expand, setExpand] = useState(true);
  return (
    <div
      onClick={() => setExpand(!expand)}
      className={`bg-base-200 text-base-content grid cursor-pointer text-sm uppercase ${expand ? "grid-cols-1 grid-rows-[auto_auto_auto] justify-items-center gap-y-2" : "grid-cols-[auto_1fr] grid-rows-2 gap-x-4"} place-content-center rounded-b-md p-4 transition-transform duration-700`}
    >
      <div
        className={`place-self-center drop-shadow-sm ${expand ? "row-span-1" : "row-span-2"} aspect-square`}
      >
        <Icon.User width={40} height={40} />
      </div>
      <div>
        <p>John Doe</p>
      </div>
      <div>
        <p>194508171968011001</p>
      </div>
    </div>
  );
}
