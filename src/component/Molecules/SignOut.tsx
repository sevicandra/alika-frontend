"use client";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { NotificationContext } from "@/lib/context/notifikasi";
import { WebPushNotificationContext } from "@/lib/context/webPushNotification";
import { useContext, useState } from "react";
import Confirmation from "./Confirmation";
export default function SignOut() {
  const router = useRouter();
  const { addNotification } = useContext(NotificationContext);
  const { unsubscribeFromPush } = useContext(WebPushNotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const signOut = async () => {
    unsubscribeFromPush();
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
      });
      if (response.ok) {
        router.push("/");
      } else {
        const { message } = await response.json();
        throw new Error(message);
      }
    } catch (error: any) {
      addNotification({
        title: "Logout",
        message: error.message,
      });
    }
  };
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="align-center grid cursor-pointer grid-cols-[50_auto] gap-2 py-2"
      >
        <span>
          <LuLogOut className="h-[25px] w-full" />
        </span>
        <span className="truncate text-left text-nowrap">Sign Out</span>
      </div>
      <Confirmation
        title="Logout"
        message="Apakah anda yakin ingin logout?"
        onConfirm={signOut}
        onCancel={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </>
  );
}
