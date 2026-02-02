export default function Home() {
  return (
    <div className="relative grid h-full grid-rows-[auto_auto_1fr] gap-2 overflow-hidden p-4">
      <div className="sticky top-0 z-10 overflow-x-auto overflow-y-hidden p-2 shadow-base-content/10">
        <h2 className="text-2xl font-bold uppercase">Dashboard</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 px-4 py-2 text-base-content shadow shadow-base-content/10">
            <div>
              <p className="text-sm">Status Mutasi</p>
            </div>
            <div className="">
              <p className="font-bold">KEP-100/KN.1/2024</p>
              <p className="text-sm">KP DJKN - KPKNL YOGYAKARTA</p>
            </div>
          </div>
          <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2 px-4 text-base-content shadow shadow-base-content/10">
            <div>
              <p className="text-sm">Document Uploaded</p>
            </div>
            <div className="">
              <p className="font-bold">3 Dari 5 Dokumen di upload</p>
            </div>
          </div>
          <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2 px-4 text-base-content shadow shadow-base-content/10">
            <div>
              <p className="text-sm">Biaya Mutasi</p>
            </div>
            <div className="">
              <p className="font-bold">Rp. 1.000.000</p>
            </div>
          </div>
          <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2 px-4 text-base-content shadow shadow-base-content/10">
            <div>
              <p className="text-sm">Update Pembayaran</p>
            </div>
            <div className="">
              <p className="font-bold">Belum Dibayar</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
              Upload Dokumen
            </button>
          </div>
          <div>
            <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
              Arsip Dokumen Mutasi
            </button>
          </div>
          <div>
            <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
              Estimasi Biaya
            </button>
          </div>
          <div>
            <button className="h-full w-full cursor-pointer gap-2 overflow-hidden rounded-box bg-primary px-4 py-1 text-primary-content shadow shadow-base-content/10 hover:shadow-lg">
              Faq
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-box bg-base-200 p-2">
        <div className="col-span-1 grid min-h-64 grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-100 p-2 shadow shadow-base-content/10 sm:col-span-2 md:col-span-4">
          <div className="relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:border-base-300 after:content-['']">
            <h3 className="font-bold">Dokumen Terbaru</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
