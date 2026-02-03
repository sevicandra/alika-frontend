"use client";
import { useEffect, useState, use } from "react";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/SetTimeline`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: JSON.stringify({
            timeline_sanggah: input.timeline_sanggah,
            timeline_verifikasi: input.timeline_verifikasi,
            timeline_spm: input.timeline_spm,
          }),
        },
      );
      if (!res.ok) {
        const { error } = await res.json();
        if (res.status === 422) {
          setValidationErrors(error.details);
        }
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Terjadi kesalahan pada server.",
        );
      }
      addNotification({
        message: "Berhasil di ubah",
        title: "Timeline",
      });
      setRefresh();
      router.back();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Timeline",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Mutasi/SDM/SuratKeputusan/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setInput({
          timeline_sanggah:
            data.Timeline.find((e: any) => e.ref_kode === "01")?.tanggal ?? "",
          timeline_verifikasi:
            data.Timeline.find((e: any) => e.ref_kode === "02")?.tanggal ?? "",
          timeline_spm:
            data.Timeline.find((e: any) => e.ref_kode === "03")?.tanggal ?? "",
        });
      } catch (error) {
        addNotification({
          title: `Surat Keputusan`,
          message: (error as Error).message,
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification, id, setInput]);
  if (error) throw error;
  return (
    <Form
      title="Update Timeline"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Update"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Timeline Sanggah</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="CalendarDays" height={20} />
            </span>
            <input
              name="timeline_sanggah"
              type="date"
              className={`input-bordered input w-full pl-10 ${getValidationError("timeline_sanggah") ? "input-error" : ""}`}
              value={input.timeline_sanggah || ""}
              onChange={(e) => {
                setInput({ ...input, timeline_sanggah: e.target.value });
              }}
            />
          </div>
          {getValidationError("timeline_sanggah") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("timeline_sanggah")}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Timeline Verifikasi
            </span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="CalendarDays" height={20} />
            </span>
            <input
              type="date"
              className={`input-bordered input w-full pl-10 ${getValidationError("timeline_verifikasi") ? "input-error" : ""}`}
              name="timeline_verifikasi"
              value={input.timeline_verifikasi || ""}
              onChange={(e) => {
                setInput({ ...input, timeline_verifikasi: e.target.value });
              }}
            />
          </div>
          {getValidationError("timeline_verifikasi") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("timeline_verifikasi")}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Timeline SPM</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="CalendarDays" height={20} />
            </span>
            <input
              type="date"
              className={`input-bordered input w-full pl-10 ${getValidationError("timeline_spm") ? "input-error" : ""}`}
              name="timeline_spm"
              value={input.timeline_spm || ""}
              onChange={(e) => {
                setInput({ ...input, timeline_spm: e.target.value });
              }}
            />
          </div>
          {getValidationError("timeline_spm") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("timeline_spm")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
