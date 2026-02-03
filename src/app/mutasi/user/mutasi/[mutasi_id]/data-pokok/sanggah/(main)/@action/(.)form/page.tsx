"use client";
import { useTable } from "@/context/table.context";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";
import { use, useEffect, useState } from "react";
import Icon from "@/component/Atoms/LabelIcon";
import { useSanggahContext } from "@/context/mutasi/user";

export default function Page({
  params,
}: {
  params: Promise<{ mutasi_id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { mutasi_id } = use(params);

  const [selectedData, setSelectedData] = useState<string>("");
  const { dataKeluarga, referensiHubungan } = useSanggahContext();
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      setValidationErrors({});
      const formData = new FormData();
      if (input.action) formData.append("action", input.action);
      if (input.nama) formData.append("nama", input.nama);
      if (input.nik) formData.append("nik", input.nik);
      if (input.hubungan) formData.append("hubungan", input.hubungan);
      if (input.tanggal_lahir)
        formData.append("tanggal_lahir", input.tanggal_lahir);
      if (input.pekerjaan) formData.append("pekerjaan", input.pekerjaan);
      if (input.status) formData.append("status", input.status);
      if (input.catatan) formData.append("catatan", input.catatan);
      if (input.file) formData.append("file", input.file);
      if (input.keluarga_id) formData.append("keluarga_id", input.keluarga_id);
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Sanggah/Data`,
        {
          method: "POST",
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          body: formData,
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
        title: "Sanggah",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Sanggah",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInput((prev: any)=>({
      ...prev,
      nama: undefined,
      nik: undefined,
      hubungan: undefined,
      tanggal_lahir: undefined,
      pekerjaan: undefined,
      status: undefined,
      catatan: undefined,
      file: undefined,
      keluarga_id: undefined,
    }));

      setSelectedData("");

    setValidationErrors({});
  }, [setValidationErrors, setInput, input.action]);

  return (
    <Form
      title="Tambah Data Sanggah"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Simpan"
      cancelText="Batalkan"
    >
      <div className="form-control pb-4">
        <label className="label after:text-error after:content-['*']">
          <span className="label-text font-semibold">Action</span>
        </label>
        <div className="relative">
          <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
            <Icon icon="ChevronsUpDown" height={20} />
          </span>
          <select
            name="action"
            className={`select-bordered select w-full select-sm pl-10 focus:outline-none ${getValidationError("action") ? "select-error" : ""}`}
            value={input.action || ""}
            onChange={(e) => setInput({ ...input, action: e.target.value })}
          >
            <option disabled value="">
              Action
            </option>
            <option value="ADD">ADD</option>
            <option value="EDIT">EDIT</option>
            <option value="REMOVE">REMOVE</option>
          </select>
        </div>
        {getValidationError("action") && (
          <label className="label">
            <span className="label-text-alt flex items-center gap-1 text-error">
              <Icon icon="CircleAlert" height={16} />{" "}
              {getValidationError("action")}
            </span>
          </label>
        )}
      </div>
      {input.action && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {(input.action === "EDIT" || input.action === "REMOVE") && (
            <div className="form-control col-span-2">
              <label className="label after:text-error after:content-['*']">
                <span className="label-text font-semibold">Data Keluarga</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="keluarga"
                  className={`select-bordered select w-full select-sm pl-10 focus:outline-none ${getValidationError("keluarga") ? "select-error" : ""}`}
                  value={selectedData}
                  onChange={(e) => {
                    setSelectedData(e.target.value);
                    setInput({
                      ...input,
                      nama:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.nama || "",
                      nik:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.nik || "",
                      tanggal_lahir:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.tanggal_lahir || "",
                      pekerjaan:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.pekerjaan || "",
                      hubungan:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.hubungan || "",
                      status:
                        dataKeluarga.find((item) => item.id === e.target.value)
                          ?.status || "",
                      catatan: "",
                      file: null,
                      keluarga_id: e.target.value,
                    });
                  }}
                >
                  <option value="">Pilih Keluarga</option>
                  {dataKeluarga.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} ({item.Ref.nama})
                    </option>
                  ))}
                </select>
              </div>
              {getValidationError("keluarga_id") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("keluarga_id")}
                  </span>
                </label>
              )}
            </div>
          )}
          {(input.action === "ADD" || input.action === "EDIT") && (
            <>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">Nama</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="FileText" height={20} />
                  </span>
                  <input
                    type="text"
                    className={`input-bordered input input-sm w-full pl-10 focus:outline-none ${getValidationError("nama") ? "input-error" : ""}`}
                    placeholder="Type here"
                    name="nama"
                    autoComplete="off"
                    value={input.nama || ""}
                    onChange={(e) =>
                      setInput({ ...input, nama: e.target.value })
                    }
                  />
                </div>
                {getValidationError("nama") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("nama")}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">NIK</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="FileText" height={20} />
                  </span>
                  <input
                    type="text"
                    className={`input-bordered input input-sm w-full pl-10 focus:outline-none ${getValidationError("nik") ? "input-error" : ""}`}
                    placeholder="Type here"
                    name="nik"
                    autoComplete="off"
                    value={input.nik || ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^\d]/g, "");
                      const numericValue = /^(0|[1-9]\d*)$/.test(rawValue);
                      if (numericValue || rawValue === "") {
                        setInput({ ...input, nik: rawValue });
                      }
                    }}
                  />
                </div>
                {getValidationError("nik") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("nik")}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">Hubungan</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="ChevronsUpDown" height={20} />
                  </span>
                  <select
                    name="hubungan"
                    className={`select-bordered select w-full select-sm pl-10 focus:outline-none ${getValidationError("hubungan") ? "select-error" : ""}`}
                    value={input.hubungan || ""}
                    onChange={(e) =>
                      setInput({ ...input, hubungan: e.target.value })
                    }
                  >
                    <option disabled value="">
                      Hubungan
                    </option>
                    {referensiHubungan.map((item) => (
                      <option key={item.kode} value={item.kode}>
                        {item.nama}
                      </option>
                    ))}
                  </select>
                </div>
                {getValidationError("hubungan") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("hubungan")}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">
                    Tanggal Lahir
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="CalendarDays" height={20} />
                  </span>
                  <input
                    type="date"
                    className={`input-bordered input input-sm w-full pl-10 focus:outline-none ${getValidationError("tanggal_lahir") ? "input-error" : ""}`}
                    name="tanggal_lahir"
                    autoComplete="off"
                    value={input.tanggal_lahir || ""}
                    onChange={(e) =>
                      setInput({ ...input, tanggal_lahir: e.target.value })
                    }
                  />
                </div>
                {getValidationError("tanggal_lahir") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("tanggal_lahir")}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">Pekerjaan</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="FileText" height={20} />
                  </span>
                  <input
                    type="text"
                    className={`input-bordered input input-sm w-full pl-10 focus:outline-none ${getValidationError("pekerjaan") ? "input-error" : ""}`}
                    placeholder="Type here"
                    name="pekerjaan"
                    autoComplete="off"
                    value={input.pekerjaan || ""}
                    onChange={(e) => {
                      setInput({ ...input, pekerjaan: e.target.value });
                    }}
                  />
                </div>
                {getValidationError("pekerjaan") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("pekerjaan")}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label after:text-error after:content-['*']">
                  <span className="label-text font-semibold">
                    Status Tanggungan
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                    <Icon icon="ChevronsUpDown" height={20} />
                  </span>
                  <select
                    name="status"
                    className={`select-bordered select w-full select-sm pl-10 focus:outline-none ${getValidationError("status") ? "select-error" : ""}`}
                    value={input.status || ""}
                    onChange={(e) =>
                      setInput({ ...input, status: e.target.value })
                    }
                  >
                    <option disabled value="">
                      Status Tanggungan
                    </option>
                    <option value="TIDAK_TERTANGGUNG">TIDAK TERTANGGUNG</option>
                    <option value="TERTANGGUNG">TERTANGGUNG</option>
                  </select>
                </div>
                {getValidationError("status") && (
                  <label className="label">
                    <span className="label-text-alt flex items-center gap-1 text-error">
                      <Icon icon="CircleAlert" height={16} />{" "}
                      {getValidationError("status")}
                    </span>
                  </label>
                )}
              </div>
            </>
          )}
          <div className="form-control col-span-2">
            <label className="label after:text-error after:content-['*']">
              <span className="label-text font-semibold">Catatan</span>
            </label>
            <textarea
              name="catatan"
              className={`textarea w-full text-base-content focus:outline-none ${getValidationError("catatan") ? "border-error" : ""}`}
              value={input.catatan || ""}
              placeholder="Type here"
              onChange={(e) => setInput({ ...input, catatan: e.target.value })}
            />
            {getValidationError("catatan") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("catatan")}
                </span>
              </label>
            )}
          </div>
          <div className="form-control col-span-2">
            <label
              className={`label ${input.action != "REMOVE" ? "after:text-error after:content-['*']" : ""} `}
            >
              <span className="label-text font-semibold">
                Dokumen Pendukung
              </span>
            </label>
            <input
              name="file"
              type="file"
              className={`file-input w-full file-input-sm text-base-content focus:outline-none ${getValidationError("file") ? "file-input-error" : ""}`}
              accept="application/pdf"
              onChange={(e) =>
                setInput({ ...input, file: e.target.files?.[0] ?? null })
              }
            />
            {getValidationError("file") && (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-error">
                  <Icon icon="CircleAlert" height={16} />{" "}
                  {getValidationError("file")}
                </span>
              </label>
            )}
          </div>
        </div>
      )}
    </Form>
  );
}
