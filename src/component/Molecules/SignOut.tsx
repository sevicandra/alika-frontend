"use client";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { NotificationContext } from "@/context/notifikasi";
import { WebPushNotificationContext } from "@/context/webPushNotification";
import { useContext, useState } from "react";
import Confirmation from "./Confirmation";
import { useSession } from "@/context/session";
export default function SignOut() {
  const router = useRouter();
  const { addNotification } = useContext(NotificationContext);
  const { unsubscribeFromPush } = useContext(WebPushNotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useSession();

  const signOutHandler = async () => {
    try {
      await signOut().then(() => {
        unsubscribeFromPush();
        addNotification({
          title: "Logout",
          message: "Berhasil logout",
        });
        router.push("/");
      });
    } catch (error) {
      addNotification({
        title: "Logout",
        message: "Gagal logout",
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
        onConfirm={signOutHandler}
        onCancel={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </>
  );
}
