import { Tabs, Item } from "@/component/Molecules/Tabs";
import { DataTable } from "@/component/Organisms/DataTable";
export default function DataTanggungan() {
  return (
    <Item
      name="Biaya Mutasi"
      className="md:mt-2 grid grid-rows-[1fr_auto] gap-1 overflow-auto"
    >
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-primary-200 text-sm relative">
          <tbody>
            <tr>
              <td colSpan={6} className="p-4 text-left">
                Biaya Angkut Pegawai dan Keluarga
              </td>
            </tr>
            <tr>
              <td className="pl-6">Trasportasi Darat</td>
              <td>4 Orang</td>
              <td>Rp2.000</td>
              <td>149 km</td>
              <td>1.192.000</td>
              <td>Bandung - Jakarta</td>
            </tr>
            <tr>
              <td className="pl-6">Pesawat</td>
              <td>4 Orang</td>
              <td>Rp1.904.000</td>
              <td></td>
              <td>5.712.000</td>
              <td>Jakarta - Medan</td>
            </tr>
            <tr>
              <td colSpan={6} className="p-4 text-left">
                Pengeriman Barang
              </td>
            </tr>
            <tr>
              <td className="pl-6">Pengepakan Darat</td>
              <td>20 m3</td>
              <td>Rp60.000</td>
              <td>100%</td>
              <td>1.200.000</td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-6">Pengiriman Darat</td>
              <td>20 m3</td>
              <td>Rp400</td>
              <td>100%</td>
              <td>1.192.000</td>
              <td>Bandung - Jakarta</td>
            </tr>
            <tr>
              <td className="pl-6">Pengepakan Laut</td>
              <td>20 m3</td>
              <td>Rp60.000</td>
              <td>100%</td>
              <td>1.200.000</td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-6">Pengiriman Laut</td>
              <td>20 m3</td>
              <td>Rp666.000</td>
              <td>100%</td>
              <td>10.656.000</td>
              <td>Jakarta - Medan</td>
            </tr>
            <tr className="">
              <td className="p-4 text-left relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:mt-3 after:w-full after:border-base-content after:border">
                Uang Harian
              </td>
              <td className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:mt-3 after:w-full after:border-base-content after:border">
                4 Orang
              </td>
              <td className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:mt-3 after:w-full after:border-base-content after:border">
                Rp530.000
              </td>
              <td className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:mt-3 after:w-full after:border-base-content after:border"></td>
              <td className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:mt-3 after:w-full after:border-base-content after:border">
                4.440.000
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}>
                <p className="p-4 text-left text-2xl">Total</p>
              </td>
              <td>
                <p className="text-2xl">19.192.000</p>
              </td>
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
