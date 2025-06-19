import { Tabs, Item } from "@/component/Molecules/Tabs";
export default function Home({
  DataTanggungan,
  BiayaMutasi,
  Dokumen,
  Submit,
  Monitoring,
}: {
  DataTanggungan: React.ReactElement;
  BiayaMutasi: React.ReactElement;
  Dokumen: React.ReactElement;
  Submit: React.ReactElement;
  Monitoring: React.ReactElement;
}) {
  return (
    <Tabs
      tabs={[
        "Data Tanggungan",
        "Biaya Mutasi",
        "Dokumen",
        "Submit",
        "Monitoring",
      ]}
      defaultTab="Data Tanggungan"
      className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr] gap-2 overflow-hidden p-2"
    >
      {DataTanggungan}
      {BiayaMutasi}
      {Dokumen}
      {Submit}
      {Monitoring}
    </Tabs>
  );
}
