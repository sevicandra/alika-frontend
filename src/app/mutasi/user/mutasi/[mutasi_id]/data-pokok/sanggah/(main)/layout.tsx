"use client";
import { useSanggahContext } from "@/context/mutasi/user";
import ContainerCard from "@/component/Molecules/ContainerCard";
export default function Page({
  selector,
  add,
  edit,
  summary,
  remove,
  submit,
}: {
  selector: React.ReactNode;
  add: React.ReactNode;
  edit: React.ReactNode;
  summary: React.ReactNode;
  remove: React.ReactNode;
  submit: React.ReactNode;
}) {
  const { form } = useSanggahContext();

  return (
    <div className="relative grid grid-rows-[1fr_auto] gap-2 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-rows-[auto_1fr_auto] gap-2 overflow-auto md:grid-cols-2">
        <ContainerCard>{selector}</ContainerCard>
        <ContainerCard title={`${form} Family`} className="row-start-2">
          {form === "add" && add}
          {form === "edit" && edit}
          {form === "remove" && remove}
        </ContainerCard>
        <ContainerCard
          title="Summary"
          className="md:col-start-2 md:row-start-1 md:row-end-3"
        >
          {summary}
        </ContainerCard>
        <ContainerCard className="md:col-span-2">{submit}</ContainerCard>
      </div>
      <div className="overflow-hidden"></div>
    </div>
  );
}
