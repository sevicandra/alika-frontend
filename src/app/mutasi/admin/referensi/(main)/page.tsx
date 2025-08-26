"use client";
import ContainerCard from "@/component/Molecules/ContainerCard";
import ReferenceCard from "@/component/Molecules/ReferenceCard";

export default function Page() {
  return (
    <ContainerCard
      title=""
      className="mx-4 grid grid-rows-[auto_1fr] overflow-x-hidden"
    >
      <div className="relative flex flex-wrap overflow-hidden">
        <div className="grid h-full w-full grid-cols-1 gap-6 overflow-y-auto p-2 lg:grid-cols-2 xl:grid-cols-3">
          <ReferenceCard
            title="Data Wilayah"
            icon="Map"
            description="Daftar provinsi dan kota untuk perhitungan biaya mutasi."
            href="/mutasi/admin/referensi/wilayah"
          />
          <ReferenceCard
            title="Data Kantor"
            icon="Building"
            description="Daftar kantor yang digunakan dalam proses mutasi."
            href="/mutasi/admin/referensi/kantor"
          />
          <ReferenceCard
            title="Rute Pesawat"
            icon="Plane"
            description="Daftar rute perjalanan menggunakan pesawat."
            href="/mutasi/admin/referensi/pesawat"
          />
          <ReferenceCard
            title="Rute Kapal"
            icon="Ship"
            description="Daftar rute perjalanan menggunakan kapal."
            href="/mutasi/admin/referensi/kapal"
          />
          <ReferenceCard
            title="Rute Darat"
            icon="Car"
            description="Daftar rute perjalanan menggunakan transportasi darat."
            href="/mutasi/admin/referensi/darat"
          />
          <ReferenceCard
            title="Golongan"
            icon="Users"
            description="Daftar golongan pegawai yang terkait dengan mutasi."
            href="/mutasi/admin/referensi/golongan"
          />
          <ReferenceCard
            title="Barang"
            icon="Package"
            description="Daftar volume barang yang dapat dimutasikan."
            href="/mutasi/admin/referensi/barang"
          />
          <ReferenceCard
            title="Referensi Hubungan Keluarga"
            icon="HeartHandshake"
            description="Daftar jenis hubungan keluarga yang relevan."
            href="/mutasi/admin/referensi/hubungan-keluarga"
          />
          <ReferenceCard
            title="Referensi Tarif"
            icon="Wallet"
            description="Daftar tarif biaya yang berlaku untuk mutasi."
            href="/mutasi/admin/referensi/tarif"
          />
          <ReferenceCard
            title="Referensi Uang Harian"
            icon="Bus"
            description="Daftar referensi uang harian untuk perjalanan dinas."
            href="/mutasi/admin/referensi/uang-harian"
          />
          <ReferenceCard
            title="Referensi Pejabat"
            icon="UserCog"
            description="Daftar pejabat yang terkait dengan proses mutasi."
            href="/mutasi/admin/referensi/pejabat"
          />
          <ReferenceCard
            title="Referensi FAQ"
            icon="UserCog"
            description="Daftar pertanyaan yang sering diajukan terkait mutasi."
            href="/mutasi/admin/referensi/faq"
          />
        </div>
        <div className="overflow-hidden"></div>
      </div>
    </ContainerCard>
  );
}
