"use client";

import { FormProvider } from "@/context/form.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <FormProvider>{children}</FormProvider>;
}
