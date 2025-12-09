"use client";
import Icon from "../Atoms/Icon";
import Typer from "../Atoms/Typer";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

export default function Splash() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 2200);
  }, []);

  return (
    <>
      {loading && (
        <Transition
          show={open}
          leave="transition ease-in duration-300 fade-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setLoading(false)}
        >
          <div className="fixed inset-0 z-100 bg-base-100">
            <div className="grid h-full place-items-center">
              <div className="grid grid-cols-[auto_auto_auto] justify-center place-self-center max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr] max-md:content-center md:h-full md:place-items-center md:space-x-8">
                <div>
                  <Icon.Loading width={200} height={200} />
                </div>
                <div className="max-md:hidden">
                  <svg
                    width="10"
                    height="200"
                    viewBox="0 0 10 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path className="fill-primary-600" d="" id="rect" />
                    <animate
                      xlinkHref="#rect"
                      attributeName="d"
                      from="M2.5 100 L2.5 100 L7.5 100 L7.5 100 Z"
                      to="M2.5 0 L2.5 200 L7.5 200 L7.5 0 Z"
                      dur="0.4s"
                      begin="1.3s"
                      fill="freeze"
                    />
                  </svg>
                </div>
                <div className="max-w-fit overflow-hidden max-md:hidden">
                  <h1 className="flex place-self-center text-9xl font-extrabold tracking-widest text-primary-600 transition-all ease-in-out after:ml-0.5 after:inline-block after:w-1 after:animate-blink after:self-stretch after:rounded-2xl after:bg-primary-600 after:content-[''] max-md:text-6xl">
                    <Typer paragraph="ALIKA" delay={1100} interval={100} />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      )}
    </>
  );
}
