"use client";
import { useEffect, useState, use } from "react";
import { useNotification } from "@/context/notifikasi";
import Loading from "@/component/Molecules/Loading";

export default function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<
    {
      userId: string;
      role_kode: string;
    }[]
  >([]);
  const [role, setRole] = useState<
    {
      id: string;
      kode: string;
      role: string;
      service_kode: string;
      description: string;
    }[]
  >([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/User/${id}/Role`, {
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
        setData(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Fetch Role",
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Sso/Referensi/Role`, {
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
        setRole(data);
      } catch (error) {
        addNotification({
          message: (error as Error).message,
          title: "Fetch Referensi Role",
          variant: "error",
        });
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) throw error;

  const addRole = async (kode: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/User/${id}/Role`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          role: kode,
        }),
      });
      const { message, error } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        message: `${message} (Status: ${res.status})`,
        title: "Add Role",
      });
      setRefresh(refresh + 1);
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Add Role",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (kode: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Sso/User/${id}/Role/${kode}`, {
        headers: {
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          role: data,
        }),
      });
      const { message, error } = await res.json();
      if (!res.ok) {
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        message: `${message} (Status: ${res.status})`,
        title: "Remove Role",
      });
      setRefresh(refresh + 1);
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Remove Role",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-24 p-2">
      {loading && (
        <div className="absolute z-10 flex h-full w-full bg-base-300/50 text-primary-600">
          <Loading />
        </div>
      )}
      {role.map((item) => (
        <div key={item.id} className="flex items-start justify-between p-4">
          <div>{item.role}</div>
          <div>
            <input
              type="checkbox"
              className="checkbox checkbox-accent"
              checked={!!data.find((d) => d.role_kode === item.kode)}
              onChange={() => {
                if (data.find((d) => d.role_kode === item.kode)) {
                  removeRole(item.kode);
                } else {
                  addRole(item.kode);
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
