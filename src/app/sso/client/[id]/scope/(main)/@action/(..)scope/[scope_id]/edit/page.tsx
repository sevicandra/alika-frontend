"use client";
import { useEffect, useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useForm } from "@/context/form.context";
import { useTable } from "@/context/table.context";
import Form from "@/component/Organisms/Form";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
    scope_id: string;
  }>;
}) {
  const { setRefresh } = useTable();
  const { id, scope_id } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<
    {
      kode: string;
      name: string;
    }[]
  >([]);
  const [scopes, setScopes] = useState<
    {
      id: string;
      kode: string;
      scope: string;
    }[]
  >([]);
  const [actions, setActions] = useState<
    {
      kode: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInput({ ...input, scope_kode: undefined });
        setLoading(true);
        const res = await fetch(`/api/Sso/Referensi/Service`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setServices(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setScopes([]);
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Sso/Referensi/Service/${input.service_kode}/Scope`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setScopes(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    if (input.service_kode) fetchData();
  }, [input.service_kode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/Referensi/ScopeAction`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setActions(data);
      } catch (error) {
        setError(error as Error);
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
      const res = await fetch(`/api/Sso/Client/${id}/Scope/${scope_id}`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil di ubah",
        title: "Scope",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Scope",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/Client/${id}/Scope/${scope_id}`, {
          method: "GET",
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setInput(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) throw error;
  return (
    <Form
      title="Ubah Scope"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Ubah"
      cancelText="Batalkan"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- Field Service --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Service</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="service_kode"
              className={`select-bordered select w-full pl-10 ${getValidationError("service_kode") ? "select-error" : ""}`}
              required
              value={input.service_kode || ""}
              onChange={(e) =>
                setInput({ ...input, service_kode: e.target.value })
              }
            >
              <option disabled value={""}>
                Pilih Service
              </option>
              {services.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("service_kode") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("service_kode")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Scope --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Scope</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="scope_id"
              className={`select-bordered select w-full pl-10 ${getValidationError("scope_id") ? "select-error" : ""}`}
              required
              value={input.scope_id || ""}
              onChange={(e) => setInput({ ...input, scope_id: e.target.value })}
            >
              <option disabled value={""}>
                Pilih Scope
              </option>
              {scopes.map((e) => (
                <option key={e.kode} value={e.id}>
                  {e.scope}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("scope_id") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("scope_id")?.message}
              </span>
            </label>
          )}
        </div>
        {/* --- Field Action --- */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text font-semibold">Action</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              <Icon icon="ChevronsUpDown" height={20} />
            </span>
            <select
              name="action_kode"
              className={`select-bordered select w-full pl-10 ${getValidationError("action_kode") ? "select-error" : ""}`}
              required
              value={input.action_kode || ""}
              onChange={(e) =>
                setInput({ ...input, action_kode: e.target.value })
              }
            >
              <option disabled value={""}>
                Pilih Action
              </option>
              {actions.map((e) => (
                <option key={e.kode} value={e.kode}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          {getValidationError("action_kode") && (
            <label className="label">
              <span className="label-text-alt flex items-center gap-1 text-error">
                <Icon icon="CircleAlert" height={16} />{" "}
                {getValidationError("action_kode")?.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}
