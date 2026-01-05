"use client";
import { useNotification } from "@/context/notifikasi";
import { Transition } from "@headlessui/react";
import { FiXCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

// ✅ FIXED: Move variant styles OUTSIDE component
// This prevents re-creating the object on every render
const variantStyles = {
  info: {
    iconColor: "alert-info",
  },
  error: {
    iconColor: "alert-error",
  },
  success: {
    iconColor: "alert-success",
  },
  warning: {
    iconColor: "alert-warning",
  },
};

export default function Notification() {
  const { notification, clearNotification, closeNotification } = useNotification();

  // ✅ FIXED: Use useEffect with proper cleanup to prevent timeout memory leaks
  // This ensures timeouts are properly cleared when component unmounts or notifications change
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    notification.forEach((n) => {
      // Only create timeout for notifications that are showing
      if (n.show) {
        const timeoutId = setTimeout(() => {
          closeNotification(n.id);
        }, 3000);
        timeoutIds.push(timeoutId);
      }
    });

    // Cleanup function: clear all timeouts to prevent memory leaks
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [notification, closeNotification]);

  return (
    <div className="absolute top-2 right-2 z-999 flex max-h-full flex-col gap-2 overflow-y-auto pr-2 pb-4">
      {notification.map((n) => {
        return (
          <Transition
            show={n.show}
            appear={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-300"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            // ✅ REMOVED: afterEnter callback
            // Timeout handling is now done in useEffect above, preventing duplicate timeouts
            afterLeave={() => {
              clearNotification(n.id);
            }}
            key={n.id}
          >
            <div
              className={cn(
                `alert w-3xs transition-all duration-150`,
                variantStyles[n.variant].iconColor
              )}
            >
              <div
                onClick={() => closeNotification(n.id)}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <FiXCircle />
              </div>
              <div>
                <div>{n.title}</div>
                <div>{n.message}</div>
              </div>
            </div>
          </Transition>
        );
      })}
    </div>
  );
}
