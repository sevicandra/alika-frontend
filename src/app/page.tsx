"use client";
import Icon from "@/component/Atoms/Icon";
import Card from "@/component/Molecules/MainModuleCard";
import ModuleCard from "@/component/Molecules/ModuleCard";
import { useSession } from "@/context/session";
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
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] overflow-hidden">
        <div className="text-base-content my-auto p-5">
          <span className="text-capitalize text-center text-3xl font-extrabold">
            <h1>Selamat Datang,</h1>
          </span>
          <span className="text-capitalize text-center text-2xl">
            <h1>{session?.user.name}</h1>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-5 items-center">
          <ModuleCard
            href="/penghasilan"
            title="Penghasilan"
            icon={<Icon.Penghasilan height={"138"} />}
            
          />
          <ModuleCard
            href="/"
            title="Sentralisasi"
            icon={<Icon.Sentralisasi height={"138"} />}
            
          />
          <ModuleCard
            href="/mutasi"
            title="Mutasi"
            icon={<Icon.Mutasi height={"138"} />}
            
          />
          <ModuleCard
            href="/"
            title="Monev"
            icon={<Icon.Monev height={"138"} />}
            
          />
        </div>
      </div>
      <Notification />
      <Themes />
    </>
  );
}
