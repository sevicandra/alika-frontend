"use client";
import { useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { usePembayaranDetail } from "@/context/mutasi/user";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";
import { useForm } from "@/context/form.context";

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
  const { setRefresh } = useTable();
  const { setRefresh: refreshPembayaran } = usePembayaranDetail();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
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
            passphrase: input.passphrase,
            confirmation: input.confirmation,
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
        message: `${message} (Status: ${res.status})`,
        title: "Kirim Tagihan",
      });
      router.back();
      setRefresh();
      refreshPembayaran();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Kirim Tagihan",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      title="Tanda Tangan Elektronik"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Process"
      cancelText="Batalkan"
    >
      <div className="grid gap-x-8 gap-y-6">
        {/* --- Field Passpharse --- */}
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
              name="passphrase"
              className={`input-bordered input w-full pl-10 ${getValidationError("passphrase") ? "input-error" : ""}`}
              required
              value={input.passphrase || ""}
              onChange={(e) => {
                setInput({ ...input, passphrase: e.target.value });
              }}
            />
          </div>
          {getValidationError("passphrase") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("passphrase")}
              </span>
            </label>
          )}
        </div>
        <div className="form-control">
          <div className="relative flex gap-2">
            <input
              type="checkbox"
              name="confirmation"
              className="checkbox"
              required
              value={input.confirmation || ""}
              onChange={(e) => {
                setInput({ ...input, confirmation: e.target.checked });
              }}
            />
            <label className="label">
              <span className="label-text text-justify text-wrap">
                Dengan ini saya menyatakan bahwa data yang saya kirimkan
                merupakan data yang benar dan sah. Saya bersedia
                mempertanggungjawabkan dan mengembalikan dana apabila terdapat
                kekeliruan.
              </span>
            </label>
          </div>
          {getValidationError("confirmation") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("confirmation")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
