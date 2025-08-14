"use client";
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useContext,
} from "react";
import { usePathname } from "next/navigation";

type account = {
  service: string;
  kode_satker: string | null;
  roles: {
    kode: string;
    role: string;
  }[];
};

interface Session {
  user: {
    sub: string;
    name: string;
    email: string;
    kode_kl: string;
    nama_kl: string;
    nip: string;
    jabatan: string;
    jenis_jabatan: string;
    kode_organisasi: string;
    organisasi: string;
    kode_satker: string;
    satker: string;
    gravatar: string;
    preferred_username: string;
  };
  account: account[];
}

interface SessionContextValue {
  data: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  update: () => Promise<void>;
  signOut: () => Promise<void>;
  changeCurrentAccount: (kode_satker: string) => void;
}


interface SessionProviderProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);
const sessionChannel = new BroadcastChannel("session_channel");

export function SessionProvider({ children }: SessionProviderProps) {
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");
  const changeCurrentAccount = (kode_satker: string) => {
    setSession((prev: Session | null) => {
      if (!prev || !prev.account) return null;
      return {
        ...prev,
        current_account: prev?.account.find(
          (a: account) => a.kode_satker === kode_satker,
        ),
      };
    });
  };
  const fetchSession = async () => {
    try {
      setStatus("loading");
      const csrf_token = await fetch("/api/auth/csrf").then((res) =>
        res.json(),
      );
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf_token.token,
        },
      });
      if (!res.ok) throw new Error("Session not found");
      const data = await res.json();
      setSession({
        user: data.user,
        account: data.account,
      });
      setStatus(data.user ? "authenticated" : "unauthenticated");
      sessionChannel.postMessage({
        type: "SESSION_UPDATE",
        session: session,
      });
    } catch (error) {
      console.error(error);
      setSession(null);
      setStatus("unauthenticated");
    }
  };
  const signOut = async () => {
    try {
      const csrf_token = await fetch("/api/auth/csrf").then((res) =>
        res.json(),
      );
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf_token.token,
        },
      });
      if (!res.ok) throw new Error("Sign out failed");
      const data = await res.json();
      if (data.status === "success") {
        setSession(null);
        setStatus("unauthenticated");
        sessionChannel.postMessage({
          type: "SESSION_UPDATE",
          session: null,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const value = useMemo(
    () => ({
      data: session,
      status,
      update: fetchSession,
      changeCurrentAccount,
      signOut,
    }),
    [session, status],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
