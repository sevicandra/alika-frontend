"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useTermin, usePembayaranDetail } from "@/context/mutasi/user";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
  }>;
}) {
  const router = useRouter();
  const { mutasi_id, pembayaran_id } = use(params);
  const { setRefresh } = useTermin();
  const { setRefresh: refreshPembayaran } = usePembayaranDetail();
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [passpharse, setPasspharse] = useState("");
  const { addNotification } = useNotification();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Kirim`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            passphrase: passpharse,
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
        message: `Kirim Tagihan berhasil dibuat`,
        title: "Kirim Tagihan",
      });
      router.back();
      setRefresh();
      refreshPembayaran();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Kirim Tagihan",
      });
    }
  }

  return (
    <form onSubmit={submitForm}>
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Passpharse</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="Key" height={20} />
                </span>
                <input
                  type="password"
                  name="passpharse"
                  className={`input-bordered input w-full pl-10 ${getValidationError("passpharse") ? "input-error" : ""}`}
                  required
                  value={passpharse}
                  onChange={(e) => {
                    setPasspharse(e.target.value);
                  }}
                />
              </div>
              {getValidationError("passpharse") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("passpharse")?.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <div className="relative flex gap-2">
                <input
                  type="checkbox"
                  name="passpharse"
                  className="checkbox"
                  required
                />
                <label className="label">
                  <span className="label-text text-justify text-wrap">
                    Dengan ini saya menyatakan bahwa data yang saya kirimkan
                    merupakan data yang benar dan sah. Saya bersedia
                    mempertanggungjawabkan dan mengembalikan dana apabila
                    terdapat kekeliruan.
                  </span>
                </label>
              </div>
              {getValidationError("passpharse") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("passpharse")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Kirim
          </button>
        </div>
      </div>
    </form>
  );
}
