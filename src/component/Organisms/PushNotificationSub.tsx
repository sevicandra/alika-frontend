"use client";
import Confirmation from "../Molecules/Confirmation";
import { useContext, useState, useEffect } from "react";
import { WebPushNotificationContext } from "@/context/webPushNotification";
export default function PushNotificationSub() {
  const { isSupported, subscription, subscribeToPush } = useContext(
    WebPushNotificationContext,
  );
  const [isOpen, setIsOpen] = useState(subscription === null);
  useEffect(() => {
    if (subscription !== null) {
      setIsOpen(false);
    }
  }, [subscription]);
  return (
    isSupported && (
      <Confirmation
        isOpen={isOpen}
        onConfirm={subscribeToPush}
        onCancel={() => setIsOpen(false)}
        message="Do you want to subscribe to push notification?"
        title="Subscribe to Push Notification"
      />
    )
  );
}
