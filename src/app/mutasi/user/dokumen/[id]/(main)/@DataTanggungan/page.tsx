"use client";
import { Tabs, Item } from "@/component/Molecules/Tabs";
import { DataTable } from "@/component/Organisms/DataTable";
import Link from "next/link";
import { use } from "react";

export default function DataTanggungan({
  main,
  params,
}: {
  main: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const data = [];
  for (let index = 0; index < 1000; index++) {
    data.push({
      no: index,
      nama: "Nama",
      tanggalLahir: "Tanggal Lahir",
      hubungan: "Hubungan",
      pekerjaan: "Pekerjaan",
    });
  }
  return (
    <Item
      name="Data Tanggungan"
      className="md:mt-2 grid grid-rows-[1fr_auto] gap-1 overflow-auto"
    >
      <div className="overflow-auto">
        <DataTable
          columns={[
            "No",
            "Nama",
            "Tanggal Lahir",
            "Umur Sesuai Tanggal SK",
            "Hubungan",
            "Pekerjaan",
          ]}
          data={data}
          renderRow={(row, index) => (
            <tr key={index}>
              <td className="p-4">{1}</td>
              <td className="p-4">Nama</td>
              <td className="p-4">Tanggal Lahir</td>
              <td className="p-4">Umur Sesuai Tanggal SK</td>
              <td className="p-4">Hubungan</td>
              <td className="p-4">Pekerjaan</td>
            </tr>
          )}
        />
      </div>
      <div className="flex justify-end gap-2 py-2 md:p-2">
        <Link href={`/mutasi/user/dokumen/${id}/sanggah`} className="btn btn-sm btn-error">
          Sanggah
        </Link>
        <button className="btn btn-sm btn-success">Selanjutnya</button>
      </div>
    </Item>
  );
}
