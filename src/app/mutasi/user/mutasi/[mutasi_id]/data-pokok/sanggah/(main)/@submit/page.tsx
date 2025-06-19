"use client";
import { useSanggahContext } from "@/context/mutasi/user";
import { use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
export default function Submit({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
  }>;
}) {
  const { revisi } = useSanggahContext();
  const { addNotification } = useNotification();
  const { mutasi_id } = use(params);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (revisi.length === 0) {
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
          if (res.status === 422) {
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
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset p-4">
        <label className="label">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            required
          />
          Saya menyatakan bahwa data yang saya berikan adalah benar dan dapat
          dipertanggungjawabkan. Saya bersedia menerima konsekuensi hukum
          apabila data yang saya berikan tidak sesuai dengan keadaan sebenarnya.
        </label>
        <div className="flex justify-end">
          <button className="btn btn-xs btn-primary">Kirim</button>
        </div>
      </fieldset>
    </form>
  );
}
