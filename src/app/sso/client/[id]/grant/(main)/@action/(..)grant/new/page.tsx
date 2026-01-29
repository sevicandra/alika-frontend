"use client";
import { useState, use, useEffect } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { setRefresh } = useTable();
  const { id } = use(params);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [grants, setGrants] = useState<
    {
      kode: string;
      grant: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/Referensi/Grant`, {
          method: "GET",
        });
        const { error, data } = await res.json();
        if (!res.ok) {
          throw new Error(
            error.message
              ? `${error.message} (Status: ${res.status})`
              : "Unknown Server Error",
          );
        }
        setGrants(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Fetch Grant",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/Client/${id}/Grant`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(input),
      });
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
        title: "Grant",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Grant",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (error) throw error;
  return (
    <Form
      title="Tambah Grant"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Tambah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Grant --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Grant</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="grant_kode"
              className={`select-bordered select w-full pl-10 ${getValidationError("grant_kode") ? "select-error" : ""}`}
              required
              value={input.grant_kode || ""}
              onChange={(e) =>
                setInput({ ...input, grant_kode: e.target.value })
              }
            >
              <option disabled value={""}>
                Pilih Grant
              </option>
              {grants.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.grant}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("grant_kode") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("grant_kode")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
