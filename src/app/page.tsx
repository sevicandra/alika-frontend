"use client";
import Icon from "@/component/Atoms/Icon";
import ModuleCard from "@/component/Molecules/ModuleCard";
import { useSession } from "@/context/session";
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
    <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] overflow-y-auto">
      <div className="my-auto p-5 text-base-content">
        <span className="text-capitalize text-center text-3xl font-extrabold">
          <h1>Selamat Datang,</h1>
        </span>
        <span className="text-capitalize text-center text-2xl">
          <h1>{session?.user.name}</h1>
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <ModuleCard
          href="/penghasilan"
          title="Penghasilan"
          icon={<Icon.Penghasilan height={"138"} />}
        />
        <ModuleCard
          href="https://sentralisasi-alika.kemenkeu.go.id"
          title="Sentralisasi"
          icon={<Icon.Sentralisasi height={"138"} />}
        />
        <ModuleCard
          href="/mutasi"
          title="Mutasi"
          icon={<Icon.Mutasi height={"138"} />}
        />
        <ModuleCard
          href="https://monev-alika.kemenkeu.go.id"
          title="Monev"
          icon={<Icon.Monev height={"138"} />}
        />
      </div>
    </div>
  );
}
