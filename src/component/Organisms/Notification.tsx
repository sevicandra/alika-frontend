"use client";
import { useContext } from "react";
import { NotificationContext } from "@/lib/context/notifikasi";
import { Transition } from "@headlessui/react";
import { FiXCircle } from "react-icons/fi";
export default function Notification() {
  const { notification, clearNotification, closeNotification } =
    useContext(NotificationContext);
  return (
    <div className="absolute top-2 right-2 z-30 flex max-h-full flex-col gap-2 overflow-y-auto pr-2 pb-4">
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
            afterEnter={() => {
              setTimeout(() => {
                closeNotification(n.id);
              }, 3000);
            }}
            afterLeave={() => {
              clearNotification(n.id);
            }}
            key={n.id}
          >
            <div className="alert alert-info w-3xs transition-all duration-150">
              <div onClick={() => closeNotification(n.id)}><FiXCircle /></div>
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
