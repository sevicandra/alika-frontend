"use client";
import ContainerCard from "@/component/Molecules/ContainerCard";

export default function Layout({
  status,
  dokumen,
  biaya,
  log,
  quickAccess,
  action,
}: {
  status: React.ReactNode;
  dokumen: React.ReactNode;
  biaya: React.ReactNode;
  log: React.ReactNode;
  quickAccess: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-4 overflow-y-auto p-4 md:overflow-hidden">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        {status}
        {dokumen}
        {biaya}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:overflow-hidden">
        <ContainerCard title="Quick Access" className="md:col-start-3 md:col-end-3 md:row-start-1">
          {quickAccess}
        </ContainerCard>
        <ContainerCard
          title="Log Pengajuan Pembayaran Mutasi"
          className="grid grid-rows-[auto_1fr] overflow-x-hidden md:col-start-1 md:col-end-3 md:row-start-1"
        >
          {log}
        </ContainerCard>
      </div>
      {action}
    </div>
  );
}
