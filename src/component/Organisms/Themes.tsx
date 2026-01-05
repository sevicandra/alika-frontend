"use client";
import { useContext } from "react";
import { ThemesContext } from "@/context/themes";
import { Transition } from "@headlessui/react";
import { FiXCircle } from "react-icons/fi";
import { themes } from "@/lib/themes";
export default function Themes() {
  const { isOpen, closeMenu, setTheme, show, handlerClose } = useContext(ThemesContext);

  return (
    isOpen && (
      <div className="fixed inset-0 z-50" onClick={handlerClose}>
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
            className="absolute right-0 grid h-full w-2xs max-w-full grid-rows-[auto_1fr] bg-base-300 text-base-content shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex bg-base-200 p-4 shadow">
              <button onClick={handlerClose} className="cursor-pointer">
                <FiXCircle />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-auto p-4">
              {themes().map((item) => (
                <div
                  className="w-full cursor-pointer border-base-200/20 bg-base-100 font-sans text-base-content shadow shadow-base-100"
                  data-theme={item}
                  key={item}
                  onClick={() => setTheme(item)}
                >
                  <div className="grid grid-cols-5 grid-rows-3">
                    <div className="col-start-1 row-span-2 row-start-1 bg-base-200"></div>
                    <div className="col-start-1 row-start-3 bg-base-300"></div>
                    <div className="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2">
                      <div className="font-bold capitalize">{item.replace("-", " ")}</div>
                      <div className="flex flex-wrap gap-1">
                        <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                          <div className="text-sm font-bold text-primary-content">A</div>
                        </div>
                        <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                          <div className="text-sm font-bold text-secondary-content">A</div>
                        </div>
                        <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                          <div className="text-sm font-bold text-accent-content">A</div>
                        </div>
                        <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                          <div className="text-sm font-bold text-neutral-content">A</div>
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
