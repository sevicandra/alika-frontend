"use client";
import { use, useState, useEffect } from "react";
import PopUp from "@/component/Molecules/PopUp";
import { PenandatanganProvider, useMutasiDetail } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";

export default function Layout({
  SetAsal,
  ResetAsal,
  SetTujuan,
  ResetTujuan,
  params,
}: {
  SetAsal: React.ReactNode;
  ResetAsal: React.ReactNode;
  SetTujuan: React.ReactNode;
  ResetTujuan: React.ReactNode;
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
    dokumen_id: string;
  }>;
}) {
  const { addNotification } = useNotification();
  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);
  const { data: mutasi } = useMutasiDetail();
  const [data, setData] = useState<{
    KantorAsal: {
      penandatangan: boolean;
      nama: string;
      nip: string;
      status: "PENDING" | "PROCESS" | "SIGNED" | "FAILED";
    };
    KantorTujuan: {
      penandatangan: boolean;
      nama: string;
      nip: string;
      status: "PENDING" | "PROCESS" | "SIGNED" | "FAILED";
    };
  }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/Status`,
        );
        if (!res.ok) {
          const { message } = await res.json();

          throw new Error(`Error: ${res.statusText}, ${message}`);
        }
        const { data } = await res.json();
        setData(data);
      } catch (error) {
        addNotification({
          title: "Status Penandatangan",
          message: `Gagal memuat data Status Penandatangan: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    };
    fetchData();
  }, [addNotification, mutasi_id, pembayaran_id, dokumen_id]);
  return (
    <PopUp title="Penandatangan SPD" className="w-lg">
      {mutasi && (
        <PenandatanganProvider
          kdSatkerAsal={mutasi.kantor_asal}
          kdSatkerTujuan={mutasi.kantor_tujuan}
        >
          {data && !data.KantorAsal.penandatangan && SetAsal}
          {data && data.KantorAsal.penandatangan && (
            <div>
              <div className="p-4">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Penandatangan SPD Keberangkatan:
                  </span>
                </label>
                <div className="form-control px-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content">
                      Nama: {data.KantorAsal.nama}
                    </span>
                  </label>
                </div>
                <div className="form-control px-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content">
                      NIP: {data.KantorAsal.nip}
                    </span>
                  </label>
                </div>
              </div>
              {data &&
                (data.KantorAsal.status === "FAILED" ||
                  data.KantorAsal.status === "PENDING") &&
                ResetAsal}
            </div>
          )}

          {(data && data.KantorAsal.status === "SIGNED" && !data.KantorTujuan.penandatangan) && SetTujuan}
          {data && data.KantorTujuan.penandatangan && (
            <div>
              <div className="p-4">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Penandatangan SPD Kedatangan:
                  </span>
                </label>
                <div className="form-control px-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content">
                      Nama: {data.KantorTujuan.nama}
                    </span>
                  </label>
                </div>
                <div className="form-control px-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content">
                      NIP: {data.KantorTujuan.nip}
                    </span>
                  </label>
                </div>
              </div>
              {data &&
                (data.KantorTujuan.status === "FAILED" ||
                  data.KantorTujuan.status === "PENDING") &&
                ResetTujuan}
            </div>
          )}
        </PenandatanganProvider>
      )}
    </PopUp>
  );
}
