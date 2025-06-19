import { DataTable } from "@/component/Organisms/DataTable";
import Link from "next/link";
export default function Home() {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div className="overflow-x-auto overflow-y-hidden flex gap-2">
        <div></div>
      </div>
      <div className="bg-base-200 rounded-box relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-auto p-2">
        <DataTable
          columns={[
            "No",
            "Nomor",
            "tanggal",
            "kantor asal",
            "kantor tujuan",
            "Status",
            "Action",
          ]}
          data={[
            {
              id: "1",
              Nomor: "1",
              tanggal: "12 Juni 2023",
              kantorAsal: "KP DJKN",
              kantorTujuan: "KPKNL YOGYAKARTA",
              Status: "1",
            },
          ]}
          renderRow={(row, index) => (
            <tr key={index}>
              <td className="p-4">{index}</td>
              <td className="p-4">{row.Nomor}</td>
              <td className="p-4">{row.tanggal}</td>
              <td className="p-4">{row.kantorAsal}</td>
              <td className="p-4">{row.kantorTujuan}</td>
              <td className="p-4">{row.Status}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link
                    href={`/mutasi/user/dokumen/${row.id}`}
                    className="btn btn-xs btn-primary"
                  >
                    Detail
                  </Link>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
