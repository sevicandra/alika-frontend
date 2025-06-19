"use client";
import { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

type NotificationContextType = {
  notification: {
    id: number | string;
    title: string;
    message: string;
    show: boolean;
  }[];
  addNotification: ({
    message,
    title,
  }: {
    message: string;
    title: string;
  }) => void;
  clearNotification: (id: number | string) => void;
  closeNotification: (id: number | string) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notification: [],
  addNotification: () => {},
  clearNotification: () => {},
  closeNotification: () => {},
});

export default function Notification({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<
    {
      id: number | string;
      title: string;
      message: string;
      show: boolean;
    }[]
  >([]);

  const addNotification = ({
    message,
    title,
  }: {
    message: string;
    title: string;
  }) => {
    setNotification((notification) => [
      ...notification,
      { id: uuidv4(), message, title, show: true },
    ]);
  };

  const clearNotification = (id: number | string) => {
    setNotification(notification.filter((n) => n.id !== id));
  };

  const closeNotification = (id: number | string) => {
    setNotification(
      notification.map((n) => {
        if (n.id === id) {
          n.show = false;
        }
        return n;
      })
    );
  };

  const contextValue = {
    notification,
    addNotification,
    clearNotification,
    closeNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
