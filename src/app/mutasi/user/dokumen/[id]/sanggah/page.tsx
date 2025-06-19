import { DataTable } from "@/component/Organisms/DataTable";
import Icon from "@/component/Atoms/LabelIcon";
import Link from "next/link";
import { use } from "react";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = [];
  for (let index = 0; index < 5; index++) {
    data.push({
      no: index,
      nama: "Nama",
      tanggalLahir: "Tanggal Lahir",
      hubungan: "Hubungan",
      pekerjaan: "Pekerjaan",
    });
  }
  return (
    <div className="bg-base-200 rounded-box relative grid grid-rows-[1fr_auto] gap-2 overflow-auto">
      <div className="p-2">
        <div>
          <div className="p-2">
            <h1 className="font-bold">Data Tanggungan</h1>
          </div>
          <DataTable
            columns={[
              "No",
              "Nama",
              "Tanggal Lahir",
              "Umur Sesuai Tanggal SK",
              "Hubungan",
              "Pekerjaan",
              "Status",
              "",
            ]}
            data={data}
            renderRow={(row, index) => (
              <tr key={index}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">Nama</td>
                <td className="p-4">Tanggal Lahir</td>
                <td className="p-4">Umur Sesuai Tanggal SK</td>
                <td className="p-4">Hubungan</td>
                <td className="p-4">Pekerjaan</td>
                <td className="p-4">
                  <select
                    name=""
                    id=""
                    className="select select-sm caret-transparent focus:outline-none"
                  >
                    <option value="Tidak Tertanggung">Tidak Tertanggung</option>
                    <option value="tertanggung">Tertanggung</option>
                  </select>
                </td>
                <td className="p-4 flex gap-1">
                  <button className="p-2 cursor-pointer hover:text-accent">
                    <Icon icon="fileText" height={16} />
                  </button>
                  <button className="btn btn-accent btn-sm text-nowrap">
                    <span className="flex gap-1">
                      <Icon icon="upload" height={16} />
                      <p>upload dokumen pendukung</p>
                    </span>
                  </button>
                </td>
              </tr>
            )}
          />
        </div>
        <div>
          <div className="p-2">
            <h1 className="font-bold">ART</h1>
          </div>
          <div className="flex gap-1 w-full max-w-3xl justify-stretch">
            <div className="grow-1">
              <div>
                <label htmlFor="nama">Nama</label>
              </div>
              <div>
                <input
                  type="text"
                  name=""
                  className="input input-sm input-bordered focus:outline-none"
                />
              </div>
            </div>
            <div className="grow-1">
              <div>
                <label htmlFor="nama">Nik</label>
              </div>
              <div>
                <input
                  type="text"
                  name=""
                  className="input input-sm input-bordered focus:outline-none"
                />
              </div>
            </div>
            <div className="grow-1">
              <div>
                <label htmlFor="nama">Upload KTP</label>
              </div>
              <div>
                <input
                  type="file"
                  name=""
                  className="file-input file-input-sm file-input-bordered focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="p-2">
            <h1 className="font-bold after:content-['*'] after:text-error after:ml-1">
              Penjelasan
            </h1>
          </div>
          <div>
            <textarea
              className="textarea w-full focus:outline-none"
              placeholder="penjelasan"
            ></textarea>
          </div>
        </div>
      </div>
      <div className=" flex justify-end gap-2 py-2 px-4">
        <Link
          href={`/mutasi/user/dokumen/${id}`}
          className="btn btn-warning btn-sm"
        >
          Kembali
        </Link>
        <button className="btn btn-success btn-sm">Simpan</button>
      </div>
    </div>
  );
}
