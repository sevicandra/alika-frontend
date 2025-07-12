"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { usePenandatangan } from "@/context/mutasi/user";
import { SearchableSelect } from "@/component/Molecules/InputForm";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
    dokumen_id: string;
  }>;
}) {
  const router = useRouter();
  const { pegawaiAsal } = usePenandatangan();
  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [dataAsal, setDataAsal] = useState<{
    nama: string;
    nip: string;
  }>({
    nama: "",
    nip: "",
  });
  const { addNotification } = useNotification();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/KantorTujuan`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            nama_pejabat: dataAsal.nama,
            nip_pejabat: dataAsal.nip,
          }),
        },
      );
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message);
      }
      addNotification({
        title: `SPD Lembar 2`,
        message: "Permohonan SPD Lembar 2 Berhasil Di Kirim",
      });
      router.back();
    } catch (error) {
      addNotification({
        title: `SPD Lembar 2`,
        message: (error as Error).message,
        variant: "error",
      });
    }
  }
  return (
    <form onSubmit={submit} autoComplete="off">
      <div className="min-h-62 bg-base-100 text-base-content shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Pilih Penandatangan SPD Kedatangan
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <SearchableSelect
                  onSelect={(val) => {
                    setDataAsal({
                      ...dataAsal,
                      nama: val.nama,
                      nip: val.nip,
                    });
                  }}
                  options={pegawaiAsal}
                  placeholder="Cari atau pilih..."
                  renderRow={(val, option, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          val(`${option.nama} / ${option.nip}`, index)
                        }
                        className="cursor-pointer border-b p-2 last:border-0 hover:bg-base-300"
                      >
                        {option.nama} / {option.nip}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-base-200/50 px-4 py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base-content">
                Penandatangan SPD Keberangkatan:
              </span>
            </label>
          </div>
          <div className="form-control px-4">
            <label className="label">
              <span className="label-text font-semibold text-base-content">
                Nama: {dataAsal.nama}
              </span>
            </label>
            {getValidationError("nama_asal") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("nama_asal")?.message}
                </span>
              </label>
            )}
          </div>
          <div className="form-control px-4">
            <label className="label">
              <span className="label-text font-semibold text-base-content">
                NIP: {dataAsal.nip}
              </span>
            </label>
            {getValidationError("nip_asal") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("nip_asal")?.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex items-center justify-end">
            <button type="submit" className="btn text-nowrap btn-primary">
              <Icon icon="FileText" height={16} /> Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
