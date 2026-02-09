"use client";
import { useState, use } from "react";
import { usePayroll } from "@/context/mutasi/keu";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { DataTable } from "@/component/Organisms/DataTable";
import Form from "@/component/Organisms/Form";
import { useForm } from "@/context/form.context";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { addNotification } = useNotification();
  const router = useRouter();
  const { setRefresh, termin } = usePayroll();
  const [loading, setLoading] = useState(false);
  const { id } = use(params);
  const { getValidationError, setValidationErrors, setInput, input } =
    useForm();
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Mutasi/Keuangan/Payroll/${id}/Download`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        method: "POST",
        body: JSON.stringify({
          terminId: termin.map((t) => t.id),
          tanggal: new Date(input.tanggal).toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        if (res.status === 422) {
          setValidationErrors(error.details);
        }
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "dokumen.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      // Create download file function
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Surat Keputusan",
        variant: "error",
      });
    } finally {
      setLoading(false);
      router.back();
    }
  }
  return (
    <Form
      title="Download Payroll"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Download"
      cancelText="Kembali"
    >
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Rincian Payroll
                </span>
              </label>
              <div className="relative max-h-36 overflow-auto">
                <DataTable
                  columns={["No", "Nama", "NIP", "Nominal"]}
                  data={termin.map((t) => ({
                    id: t.id,
                    nama: t.nama,
                    nip: t.nip,
                    nominal: t.nominal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }),
                  }))}
                  renderRow={(row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{row.nama}</td>
                      <td className="px-4 py-2">{row.nip}</td>
                      <td className="px-4 py-2">{row.nominal}</td>
                    </tr>
                  )}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nilai Payroll</span>
              </label>
              <div className="relative">
                {termin
                  .reduce((acc, cur) => acc + cur.nominal, 0)
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
              </div>
            </div>

            {/* --- Field Tanggal --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Tanggal Payroll
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tanggal"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tanggal") ? "input-error" : ""}`}
                  value={input.tanggal || ""}
                  onChange={(e) =>
                    setInput({ ...input, tanggal: e.target.value })
                  }
                />
              </div>
              {getValidationError("tanggal") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tanggal")}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
