"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<
    | {
        id: string;
        tanggal: Date;
        nomor: string;
        kantor_asal: string;
        kantor_tujuan: string;
        status: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Mutasi/Pegawai/Dashboard/Status");
        if (!response.ok) {
          if (response.status === 404) {
            return;
          }
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative max-h-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div className="grid min-h-32 grid-rows-[32px_1fr] gap-2 overflow-hidden rounded-box bg-base-200 px-4 py-2 text-base-content shadow shadow-base-content/10">
            <div>
              <p className="text-sm">Status Mutasi</p>
            </div>
            <div className="">
              <p className="font-bold">{data?.nomor}</p>
              <p className="text-sm">
                {data?.kantor_asal} - {data?.kantor_tujuan}
              </p>
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
        <div className="col-span-1 grid min-h-64 grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2 shadow shadow-base-content/10 sm:col-span-2 md:col-span-4">
          <div className="relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:border-base-300 after:content-['']">
            <h3 className="font-bold">Dokumen Terbaru</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
