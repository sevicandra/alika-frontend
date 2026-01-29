"use client";
import { use, useState, useEffect } from "react";
import PopUp from "@/component/Molecules/PopUp";
import { PenandatanganProvider, useMutasiDetail } from "@/context/mutasi/user";
import { useNotification } from "@/context/notifikasi";
import { FormProvider } from "@/context/form.context";

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
  const [children, setChildren] = useState<"Kantor_Asal" | "Kantor_Tujuan">(
    "Kantor_Asal",
  );

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
          <div className="flex flex-col px-2 py-4">
            <div className="flex justify-stretch">
              <button
                className={`btn grow btn-outline btn-xs btn-info ${children === "Kantor_Asal" ? "btn-active" : ""}`}
                onClick={() => setChildren("Kantor_Asal")}
              >
                Kantor Asal
              </button>
              <button
                className={`btn grow btn-outline btn-xs btn-info ${children === "Kantor_Tujuan" ? "btn-active" : ""}`}
                onClick={() => setChildren("Kantor_Tujuan")}
              >
                Kantor Tujuan
              </button>
            </div>
            <div>
              {data ? (
                children === "Kantor_Asal" ? (
                  !data.KantorAsal.penandatangan ? (
                    <FormProvider>{SetAsal}</FormProvider>
                  ) : (
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
                          data.KantorAsal.status === "PENDING") && (
                          <FormProvider>{ResetAsal}</FormProvider>
                        )}
                    </div>
                  )
                ) : !data.KantorTujuan.penandatangan ? (
                  <FormProvider>{SetTujuan}</FormProvider>
                ) : (
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
                        data.KantorTujuan.status === "PENDING") && (
                        <FormProvider>{ResetTujuan}</FormProvider>
                      )}
                  </div>
                )
              ) : (
                <div className="flex justify-center p-4">
                  <span className="loading loading-spinner"></span>
                </div>
              )}
            </div>
          </div>
        </PenandatanganProvider>
      )}
    </PopUp>
  );
}
