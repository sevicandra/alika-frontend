"use client";
import { useState, useEffect } from "react";
import { useSanggahContext } from "@/context/mutasi/user";
import { snackToTitleCase } from "@/helpers/string.helper";
import { useNotification } from "@/context/notifikasi";

export default function SanggahForm() {
  const { addNotification } = useNotification();
  const { dataKeluarga, revisi, addRevisi } = useSanggahContext();
  const [selectedData, setSelectedData] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string;
      message: string;
    }[]
  >([]);
  const [data, setData] = useState<{
    nama: string;
    nik: string;
    hubungan: string;
    tanggal_lahir: string;
    pekerjaan: string;
    status: string;
    catatan: string;
  }>({
    nama: "",
    nik: "",
    tanggal_lahir: "",
    pekerjaan: "",
    hubungan: "",
    status: "",
    catatan: "",
  });

  useEffect(() => {
    if (selectedData) {
      const selectedKeluarga = dataKeluarga.find(
        (item) => item.id === selectedData,
      );
      if (selectedKeluarga) {
        setData({
          nama: selectedKeluarga.nama || "",
          nik: selectedKeluarga.nik || "",
          tanggal_lahir: selectedKeluarga.tanggal_lahir || "",
          pekerjaan: selectedKeluarga.pekerjaan || "",
          hubungan: selectedKeluarga.hubungan || "",
          status: selectedKeluarga.status || "",
          catatan: "",
        });
      }
    }
  }, [selectedData, dataKeluarga]);

  const handleRemove = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: {
      field: string;
      message: string;
    }[] = [];
    if (selectedData) {
      setValidationErrors([]);
      if (confirm("Anda yakin ingin menghapus data ini?")) {
        if (!data.catatan)
          validationErrors.push({
            field: "catatan",
            message: "Catatan belum diisi",
          });

        if (validationErrors.length > 0) {
          setValidationErrors(validationErrors);
          return;
        }

        if (
          revisi
            .filter((r) => r.action !== "add")
            .some((r) => r.id === selectedData)
        ) {
          addNotification({
            message: "Data sudah dibuat, silahkan hapus dan buat ulang",
            title: "Edit keluarga",
          });
          return;
        }
        addRevisi({
          id: selectedData,
          action: "remove",
          nama:
            dataKeluarga.find((item) => item.id === selectedData)?.nama || "",
          catatan: data.catatan,
        });
        setSelectedData("");
        setData({
          nama: "",
          nik: "",
          tanggal_lahir: "",
          pekerjaan: "",
          hubungan: "",
          status: "",
          catatan: "",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-2 p-4">
        <select
          name="status"
          className="select w-full border-base-content/20 bg-base-200 select-sm text-base-content focus:outline-none"
          required
          value={selectedData}
          onChange={(e) => setSelectedData(e.target.value)}
        >
          <option value="">Pilih Keluarga</option>
          {dataKeluarga
            .filter(
              (item) =>
                revisi
                  .filter((r) => r.action !== "add")
                  .some((r) => r.id === item.id) === false,
            )
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.Ref.nama})
              </option>
            ))}
        </select>
      </div>
      {selectedData && (
        <>
          <div className="px-4">
            <div className="rounded-box bg-base-200 p-2 text-sm">
              <h1 className="font-bold">Current Data</h1>
              <p>
                NIK:{" "}
                {dataKeluarga.find((item) => item.id === selectedData)?.nik}
              </p>
              <p>
                Tanggal Lahir:{" "}
                {
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.tanggal_lahir
                }
              </p>
              <p>
                Pekerjaan:{" "}
                {
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.pekerjaan
                }
              </p>
              <p>
                Status:{" "}
                {snackToTitleCase(
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.status || "",
                )}
              </p>
            </div>
          </div>
          <form onSubmit={handleRemove}>
            <div className="grid grid-cols-2 gap-1 px-4 pb-4">
              <div className="col-span-2">
                <label className="label text-base-content after:text-error after:content-['*']">
                  Catatan:
                </label>
                <textarea
                  name="catatan"
                  className={`textarea w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "catatan") ? "border-error" : ""}`}
                  value={data.catatan}
                  placeholder="Type here"
                  onChange={(e) =>
                    setData({ ...data, catatan: e.target.value })
                  }
                />
                {validationErrors.find((e) => e.field === "catatan") && (
                  <p className="label text-xs font-bold text-error">
                    {
                      validationErrors.find((e) => e.field === "catatan")
                        ?.message
                    }
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn col-span-2 mt-4 btn-sm btn-error"
              >
                Remove
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
