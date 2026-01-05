"use client";
import Confirmation from "../Molecules/Confirmation";
import { useContext, useState } from "react";
import { WebPushNotificationContext } from "@/context/webPushNotification";
export default function PushNotificationSub() {
  const { isSupported, subscription, subscribeToPush } = useContext(WebPushNotificationContext);

  const [isShow, setIsShow] = useState(true);

  const isOpen = subscription === null && isShow;

  return (
    isSupported && (
      <Confirmation
        isOpen={isOpen}
        onConfirm={subscribeToPush}
        onCancel={() => setIsShow(false)}
        message="Do you want to subscribe to push notification?"
        title="Subscribe to Push Notification"
      />
    )
  );
}
