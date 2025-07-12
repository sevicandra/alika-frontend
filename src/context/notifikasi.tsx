"use client";
import { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

type NotificationContextType = {
  notification: {
    id: string;
    title: string;
    message: string;
    show: boolean;
    variant: "info" | "error" | "success" | "warning";
  }[];
  addNotification: ({
    message,
    title,
    variant
  }: {
    message: string;
    title: string;
    variant?: "info" | "error" | "success" | "warning";
  }) => void;
  clearNotification: (id: string) => void;
  closeNotification: (id: string) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notification: [],
  addNotification: () => {},
  clearNotification: () => {},
  closeNotification: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<
    {
      id: string;
      title: string;
      message: string;
      show: boolean;
      variant: "info" | "error" | "success" | "warning";
    }[]
  >([]);

  const addNotification = ({
    message,
    title,
    variant,
  }: {
    message: string;
    title: string;
    variant?: "info" | "error" | "success" | "warning";
  }) => {
    setNotification((notification) => [
      ...notification,
      { id: uuidv4(), message, title, show: true, variant: variant || "info" },
    ]);
  };

  const clearNotification = (id: string) => {
    setNotification(notification.filter((n) => n.id !== id));
  };

  const closeNotification = (id: string) => {
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
      "useNotification must be used within a NotificationProvider" // Pesan error sudah benar, tidak perlu diubah jika nama komponen provider diubah.
    );
  }
  return context;
}
