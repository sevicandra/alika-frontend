import { Item } from "@/component/Molecules/Tabs";

export default function DataTanggungan() {
  return (
    <Item
      name="Dokumen"
      className="md:mt-2 grid grid-rows-[1fr_auto] gap-1 overflow-auto"
    >
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-primary-200 text-sm relative">
          <thead>
            <tr className={`sticky top-0 border-0 bg-primary-100 `}>
              <th className="px-4 py-2 text-left text-sm font-semibold text-primary-700">
                Dokumen
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-primary-700">
                Upload
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-primary-700">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-primary-700">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100 bg-base-100">
            <tr>
              <td className="p-4">KP4</td>
              <td className="p-4">
                <div>
                  <button className="btn btn-xs btn-accent">
                    Upload Dokumen Pendukung
                  </button>
                </div>
              </td>
              <td className="p-4">Status</td>
              <td>Approved</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 py-2 md:p-2">
        <button className="btn btn-sm btn-success">Selanjutnya</button>
      </div>
    </Item>
  );
}
