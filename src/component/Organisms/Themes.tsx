"use client";
import { useContext, useEffect } from "react";
import { ThemesContext } from "@/context/themes";
import { Transition } from "@headlessui/react";
import { FiXCircle } from "react-icons/fi";
import { useState } from "react";
import { themes } from "@/lib/themes";
export default function Notification() {
  const { isOpen, closeMenu, setTheme } = useContext(ThemesContext);
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    }
  }, [isOpen]);
  return (
    isOpen && (
      <div className="fixed inset-0 z-50" onClick={() => setShow(false)}>
        <Transition
          show={show}
          appear={true}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transition ease-in duration-300"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
          afterLeave={closeMenu}
        >
          <div
            className="bg-base-300 text-base-content absolute right-0 grid h-full w-2xs max-w-full grid-rows-[auto_1fr] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-base-200 flex p-4 shadow">
              <button onClick={() => setShow(false)} className="cursor-pointer">
                <FiXCircle />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-auto p-4">
              {themes().map((item) => (
                <div
                  className="bg-base-100 text-base-content w-full cursor-pointer font-sans shadow shadow-base-100 border-base-200/20"
                  data-theme={item}
                  key={item}
                  onClick={() => setTheme(item)}
                >
                  <div className="grid grid-cols-5 grid-rows-3">
                    <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                    <div className="bg-base-300 col-start-1 row-start-3"></div>
                    <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                      <div className="font-bold capitalize">{item.replace("-", " ")}</div>
                      <div className="flex flex-wrap gap-1">
                        <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-primary-content text-sm font-bold">
                            A
                          </div>
                        </div>
                        <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-secondary-content text-sm font-bold">
                            A
                          </div>
                        </div>
                        <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-accent-content text-sm font-bold">
                            A
                          </div>
                        </div>
                        <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-neutral-content text-sm font-bold">
                            A
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Transition>
      </div>
    )
  );
}
