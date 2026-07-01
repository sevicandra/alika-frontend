"use client";

import Button from "@/components/atoms/button.atom";
import { Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
};

const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  title = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  className,
}: ConfirmationModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return show ? (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 pt-20 backdrop-blur-sm transition-all duration-300",
        className,
      )}
      onClick={onCancel}
    >
      <Transition
        show={isOpen}
        appear={true}
        enter="transform ease-out duration-300 transition"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
        afterLeave={() => setShow(false)}
      >
        <div
          className="flex w-full max-w-sm flex-col gap-4 rounded-box border border-base-300 bg-base-200 p-6 text-base-content shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-center text-lg font-bold text-base-content">
              {title}
            </h3>
            {message && (
              <p className="mt-1 text-center text-sm text-base-content/75">
                {message}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button
              variant="neutral"
              size="sm"
              className="border border-base-300 btn-ghost"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button variant="error" size="sm" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  ) : null;
};

export default ConfirmationModal;
