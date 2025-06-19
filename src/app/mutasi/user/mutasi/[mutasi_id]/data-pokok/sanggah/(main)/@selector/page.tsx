"use client";
import { useSanggahContext } from "@/context/mutasi/user";

export default function SanggahSelector() {
  const {form, setForm} = useSanggahContext();
  return (
    <fieldset className="fieldset p-4">
      <label className="label">
        <input type="checkbox" checked={form === "add"} onChange={() => setForm("add")} className="checkbox checkbox-primary" />
        Add
      </label>
      <label className="label">
        <input type="checkbox" checked={form === "edit"} onChange={() => setForm("edit")} className="checkbox checkbox-primary" />
        Edit
      </label>
      <label className="label">
        <input type="checkbox" checked={form === "remove"} onChange={() => setForm("remove")} className="checkbox checkbox-primary" />
        Remove
      </label>
    </fieldset>
  );
}
