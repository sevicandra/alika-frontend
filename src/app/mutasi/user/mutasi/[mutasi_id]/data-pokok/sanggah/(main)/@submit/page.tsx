"use client";
import { useSanggahContext } from "@/context/mutasi/user";
import { use, useState } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Submit({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { revisi } = useSanggahContext();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { mutasi_id } = use(params);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (revisi.length === 0) {
      addNotification({
        title: "Sanggah Mutasi",
        message: "Tidak ada data revisi untuk dikirim.",
      });
      setIsLoading(false);
      return;
    }
    if (confirm("Anda yakin ingin mengirimkan data ini?")) {
      try {
        const formData = new FormData();
        revisi.forEach((item, i) => {
          if (item.action === "add") {
            formData.append(
              `data[${i}][data]`,
              JSON.stringify({
                ...item.data,
              }),
            );
            formData.append(`data[${i}][file]`, item.file);
            formData.append(`data[${i}][catatan]`, item.catatan);
          }

          if (item.action === "edit") {
            formData.append(
              `data[${i}][data]`,
              JSON.stringify({
                ...item.data,
              }),
            );
            if (item.file) formData.append(`data[${i}][file]`, item.file);
            formData.append(`data[${i}][catatan]`, item.catatan);
            formData.append(`data[${i}][id]`, item.id);
          }

          if (item.action === "remove") {
            formData.append(`data[${i}][id]`, item.id);
            formData.append(`data[${i}][catatan]`, item.catatan);
          }

          formData.append(`data[${i}][action]`, item.action);
        });
        const res = await fetch(
          `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah`,
          {
            headers: {
              "X-CSRF-Token": await fetch("/api/auth/csrf").then(
                async (res) => {
                  const data = await res.json();
                  return data.token;
                },
              ),
            },
            method: "POST",
            body: formData,
          },
        );
        if (!res.ok) {
          const { message, errors } = await res.json();
          if (res.status === 422 && errors && Array.isArray(errors)) {
            for (const error of errors) {
              addNotification({
                title: "Sanggah Mutasi",
                message: error.message,
              });
            }
          }
          throw new Error(message);
        }
        addNotification({
          title: "Sanggah Mutasi",
          message: "Data berhasil dikirimkan",
        });
        router.replace("/mutasi/user/mutasi");
      } catch (error) {
        addNotification({
          title: "Sanggah Mutasi",
          message: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset p-4">
        <label className="label">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          Saya menyatakan bahwa data yang saya berikan adalah benar dan dapat
          dipertanggungjawabkan. Saya bersedia menerima konsekuensi hukum
          apabila data yang saya berikan tidak sesuai dengan keadaan sebenarnya.
        </label>
        <div className="mt-4 flex justify-end">
          <Link
            href={`/mutasi/user/mutasi/${mutasi_id}/data-pokok/sanggah/kirim`}
            className={`btn btn-xs btn-primary ${!checked && "btn-disabled"}`}
          >
            {isLoading ? "Mengirim..." : "Kirim"}
          </Link>
        </div>
      </fieldset>
    </form>
  );
}
