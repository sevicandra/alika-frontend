"use client";
import Button from "../Atoms/Button";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
export default function Confirmation({
  isOpen,
  onConfirm,
  onCancel,
  message,
  title = "Are you sure?",
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  title?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    }
  }, [isOpen]);

  return (
    show && (
      <div
        className="fixed inset-0 z-50 px-2 backdrop-blur-xs transition-all delay-75 duration-300"
        onClick={() => onCancel()}
      >
        <Transition
          show={isOpen}
          appear={true}
          enter="transform ease-out duration-300 transition"
          enterFrom="-translate-y-full opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-300"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-full opacity-0"
          afterLeave={() => setShow(false)}
        >
          <div
            className="bg-primary text-primary-content rounded-box border-primary-content/40 absolute top-10 left-1/2 flex w-xs max-w-full translate-x-[-50%] flex-col gap-2 border p-4 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <h2 className="text-xl">{title}</h2>
            </div>
            <div className="flex justify-center">
              <p className="text-sm">{message}</p>
            </div>
            <div className="flex justify-center gap-2">
              <Button className="btn-sm btn-error" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                className="btn-sm btn-success"
                onClick={() => onConfirm()}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    )
  );
}
