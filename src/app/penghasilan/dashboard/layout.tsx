"use client";
import DashboardProvider from "@/lib/context/penghasilan/dashboard";
import { useEffect } from "react";
import { useSession } from "@/lib/context/session";
const Layout = ({
  gapok,
  tukin,
  umak,
  lembur,
  bulanan,
  dokumen,
  tahun,
}: {
  gapok: React.ReactElement;
  tukin: React.ReactElement;
  umak: React.ReactElement;
  lembur: React.ReactElement;
  bulanan: React.ReactElement;
  dokumen: React.ReactElement;
  tahun: React.ReactElement;
}) => {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthenticated");
      window.location.href = "/api/auth/signin";
    }
  }, [status]);
  return (
    <DashboardProvider>
      <div className="relative max-h-full overflow-y-auto">
        <div className="bg-base-200 sticky top-0 z-10 overflow-x-auto overflow-y-hidden p-3 shadow-xs shadow-base-content/10">
          {tahun}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {gapok}
            {tukin}
            {umak}
            {lembur}
          </div>
          <div className="bg-base-200 rounded-box grid min-h-62 grid-rows-[auto_1fr] gap-2 overflow-hidden p-2">
            <div className="after:border-base-300 relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:content-['']">
              <h3 className="font-bold">Penghasilan Bulanan</h3>
            </div>
            {bulanan}
          </div>
          <div className="bg-base-200 rounded-box grid grid-rows-[auto_1fr] gap-2 overflow-hidden p-2">
            <div className="after:border-base-300 relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:content-['']">
              <h3 className="font-bold">Dokumen Terbaru</h3>
            </div>
            {dokumen}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Layout;
