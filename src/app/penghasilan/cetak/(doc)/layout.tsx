'use client';
import GroupButton from "@/component/Molecules/GroupButton";
import CetakDocProvider from "@/lib/context/penghasilan/cetakDoc";
import { useEffect } from "react";
import { useSession } from "@/lib/context/session";
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { status } = useSession();
    useEffect(() => {
      if (status === "unauthenticated") {
        console.log("unauthenticated");
        window.location.href = "/api/auth/signin";
      }
    }, [status]);
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div>
        <GroupButton
          button={[
            {
              name: "Kembali",
              type: "link",
              href: "/penghasilan/cetak",
            },
          ]}
        />
      </div>
      <CetakDocProvider>{children}</CetakDocProvider>
    </div>
  );
}
