import RincianProvider from "@/lib/context/penghasilan/rincian";
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RincianProvider>
      {children}
    </RincianProvider>
  );
}
