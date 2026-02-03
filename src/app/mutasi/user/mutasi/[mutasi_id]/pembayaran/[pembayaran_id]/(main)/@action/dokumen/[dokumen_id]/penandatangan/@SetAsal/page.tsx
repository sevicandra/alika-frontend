"use client";
import { use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { usePenandatangan } from "@/context/mutasi/user";
import { SearchableSelect } from "@/component/Molecules/InputForm";
import { useForm } from "@/context/form.context";
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
  const { getValidationError, setValidationErrors, input, setInput } =
    useForm();
  const { addNotification } = useNotification();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/KantorAsal`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            nama: input.nama,
            nip: input.nip,
          }),
        },
      );
      const { message, error } = await res.json();
      if (!res.ok) {
        if (res.status === 422) {
          setValidationErrors(error.details);
        }
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        title: `SPD Lembar 2`,
        message: `${message} (Status: ${res.status})`,
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
                  Pilih Penandatangan SPD Keberangkatan
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <SearchableSelect
                  onSelect={(val) => {
                    setInput({
                      ...input,
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
                Nama:
              </span>
            </label>
            <div>{input.nama}</div>
            {getValidationError("nama") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("nama")}
                </span>
              </label>
            )}
          </div>
          <div className="form-control px-4">
            <label className="label">
              <span className="label-text font-semibold text-base-content">
                NIP:
              </span>
            </label>
            <div>{input.nip}</div>
            {getValidationError("nip") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("nip")}
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
