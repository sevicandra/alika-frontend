"use client";
import Icon from "@/component/Atoms/Icon";
import Card from "@/component/Molecules/MainModuleCard";
import { useSession } from "@/lib/context/session";
import Notification from "@/component/Organisms/Notification";
import Themes from "@/component/Organisms/Themes";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthenticated");
      window.location.href = "/api/auth/signin";
    }
  }, [status]);
  return (
    <>
      <div className="grid grid-cols-1 overflow-hidden">
        <div className="text-base-content my-auto">
          <span className="text-capitalize text-center text-3xl font-extrabold">
            <h1>Selamat Datang,</h1>
          </span>
          <span className="text-capitalize text-center text-2xl">
            <h1>{session?.user.name}</h1>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          <Card href="/penghasilan" label="Penghasilan">
            <Icon.Penghasilan width="100%" height="100%" />
          </Card>
          <Card href="/" label="Sentralisasi">
            <Icon.Sentralisasi width="100%" height="100%" />
          </Card>
          <Card href="/mutasi" label="Mutasi">
            <Icon.Mutasi width="100%" height="100%" />
          </Card>
          <Card href="/" label="Monev">
            <Icon.Monev width="100%" height="100%" />
          </Card>
        </div>
      </div>
      <Notification />
      <Themes />
    </>
  );
}
