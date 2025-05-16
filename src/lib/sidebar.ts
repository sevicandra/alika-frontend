"use server";
export type MenuType = {
  title: string | undefined;
  data: {
    label: string;
    path: string;
    icon: string;
  }[];
};

export const menus = async ({ module }: { module: string }): Promise<MenuType[]> => {
  if (module === "Penghasilan") {
    return [
      {
        title: "",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
    ];
  } else if (module === "Mutasi") {
    return [
      {
        title: "Mutasi",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
      {
        title: "Estimasi",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
      {
        title: "SDM",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
      {
        title: "Keuangan",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
      {
        title: "Admin",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "desktop",
          },
          { label: "Rincian", path: "/penghasilan/rincian", icon: "buffer" },
          { label: "Cetak", path: "/penghasilan/cetak", icon: "print" },
          { label: "TTE", path: "/penghasilan/tte", icon: "file-signature" },
        ],
      },
    ];
  } else {
    return [];
  }
};
