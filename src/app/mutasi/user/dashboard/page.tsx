export default function Home() {
  return (
    <div className="relative max-h-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-base-200 text-base-content shadow shadow-base-content/10 rounded-box grid grid-rows-[32px_1fr] gap-2 overflow-hidden py-2 px-4 min-h-32">
            <div>
              <p className="text-sm">Status Mutasi</p>
            </div>
            <div className="">
              <p className="font-bold">KEP-100/KN.1/2024</p>
              <p className="text-sm">KP DJKN - KPKNL YOGYAKARTA</p>
            </div>
          </div>
          <div className="bg-base-200 text-base-content shadow shadow-base-content/10 rounded-box grid grid-rows-[32px_1fr] gap-2 overflow-hidden p-2 px-4 min-h-32">
            <div>
              <p className="text-sm">Document Uploaded</p>
            </div>
            <div className="">
              <p className="font-bold">3 Dari 5 Dokumen di upload</p>
            </div>
          </div>
          <div className="bg-base-200 text-base-content shadow shadow-base-content/10 rounded-box grid grid-rows-[32px_1fr] gap-2 overflow-hidden p-2 px-4 min-h-32">
            <div>
              <p className="text-sm">Biaya Mutasi</p>
            </div>
            <div className="">
              <p className="font-bold">Rp. 1.000.000</p>
            </div>
          </div>
          <div className="bg-base-200 text-base-content shadow shadow-base-content/10 rounded-box grid grid-rows-[32px_1fr] gap-2 overflow-hidden p-2 px-4 min-h-32">
            <div>
              <p className="text-sm">Update Pembayaran</p>
            </div>
            <div className="">
              <p className="font-bold">Belum Dibayar</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <button className="bg-primary w-full h-full cursor-pointer text-primary-content shadow hover:shadow-lg shadow-base-content/10 rounded-box gap-2 overflow-hidden py-1 px-4">
              Upload Dokumen
            </button>
          </div>
          <div>
            <button className="bg-primary w-full h-full cursor-pointer text-primary-content shadow hover:shadow-lg shadow-base-content/10 rounded-box gap-2 overflow-hidden py-1 px-4">
              Arsip Dokumen Mutasi
            </button>
          </div>
          <div>
            <button className="bg-primary w-full h-full cursor-pointer text-primary-content shadow hover:shadow-lg shadow-base-content/10 rounded-box gap-2 overflow-hidden py-1 px-4">
              Estimasi Biaya
            </button>
          </div>
          <div>
            <button className="bg-primary w-full h-full cursor-pointer text-primary-content shadow hover:shadow-lg shadow-base-content/10 rounded-box gap-2 overflow-hidden py-1 px-4">
              Faq
            </button>
          </div>
        </div>
        <div className="bg-base-200 min-h-64 rounded-box grid grid-rows-[auto_1fr] shadow shadow-base-content/10 gap-2 overflow-hidden p-2 col-span-1 md:col-span-4 sm:col-span-2">
          <div className="after:border-base-300 relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:content-['']">
            <h3 className="font-bold">Dokumen Terbaru</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
