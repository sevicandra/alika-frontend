"use server";
export type MenuType = {
  title: string | undefined;
  role?: string | undefined;
  data: {
    label: string;
    path: string;
    icon: string;
  }[];
};

export const menus = async ({
  module,
}: {
  module: string;
}): Promise<MenuType[]> => {
  if (module === "Penghasilan") {
    return [
      {
        title: "",
        data: [
          {
            label: "Dashboard",
            path: "/penghasilan/dashboard",
            icon: "LayoutDashboard",
          },
          {
            label: "Rincian",
            path: "/penghasilan/rincian",
            icon: "ClipboardList",
          },
          {
            label: "Cetak",
            path: "/penghasilan/cetak",
            icon: "Printer",
          },
          {
            label: "TTE",
            path: "/penghasilan/tte",
            icon: "FilePenLine",
          },
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
            path: "/mutasi/user/dashboard",
            icon: "LayoutDashboard",
          },
          {
            label: "Mutasi",
            path: "/mutasi/user/mutasi",
            icon: "Repeat",
          },
          {
            label: "TTE",
            path: "/mutasi/user/tte",
            icon: "FilePenLine",
          },
        ],
      },
      {
        title: "Bagian SDM",
        role: "SDM",
        data: [
          // {
          //   label: "Dashboard",
          //   path: "/mutasi/sdm/dashboard",
          //   icon: "LayoutDashboard",
          // },
          {
            label: "SK Mutasi",
            path: "/mutasi/sdm/sk",
            icon: "FileBadge2",
          },
          {
            label: "Sanggah",
            path: "/mutasi/sdm/sanggah",
            icon: "MessageCircleWarning",
          },
          {
            label: "Permohonan Pembayaran",
            path: "/mutasi/sdm/permohonan-pembayaran",
            icon: "FolderSearch2",
          },
          {
            label: "Arsip",
            path: "/mutasi/sdm/arsip",
            icon: "Archive",
          },
        ],
      },
      {
        title: "Bagian KEU",
        role: "KEUANGAN",
        data: [
          // {
          //   label: "Dashboard",
          //   path: "/mutasi/keuangan/dashboard",
          //   icon: "LayoutDashboard",
          // },
          {
            label: "SK Mutasi",
            path: "/mutasi/keuangan/sk",
            icon: "FileBadge2",
          },
          {
            label: "Permohonan Pembayaran",
            path: "/mutasi/keuangan/permohonan-pembayaran",
            icon: "FolderSearch2",
          },
          {
            label: "Payroll",
            path: "/mutasi/keuangan/payroll",
            icon: "Receipt",
          },
        ],
      },
      {
        title: "PPK",
        role: "PPK",
        data: [
          {
            label: "SK Mutasi",
            path: "/mutasi/ppk/sk",
            icon: "FileBadge2",
          },
          {
            label: "TTE",
            path: "/mutasi/ppk/tte",
            icon: "FilePenLine",
          },
        ],
      },
      {
        title: "BENDAHARA",
        role: "BENDAHARA",
        data: [
          {
            label: "SK Mutasi",
            path: "/mutasi/bendahara/sk",
            icon: "FileBadge2",
          },
          {
            label: "TTE",
            path: "/mutasi/bendahara/tte",
            icon: "FilePenLine",
          },
        ],
      },
      {
        title: "Admin",
        role: "ADMIN",
        data: [
          {
            label: "User",
            path: "/mutasi/admin/user",
            icon: "UserCog",
          },
          {
            label: "Referensi",
            path: "/mutasi/admin/referensi",
            icon: "FileSearch",
          },
        ],
      },
    ];
  } else if (module === "Sso") {
    return [
      {
        title: "Data",
        data: [
          {
            label: "client",
            path: "/sso/client",
            icon: "Users",
          },
          {
            label: "user",
            path: "/sso/user",
            icon: "User",
          },
        ],
      },
      {
        title: "Referensi",
        data: [
          {
            label: "service",
            path: "/sso/service",
            icon: "Server",
          },
          {
            label: "scope action",
            path: "/sso/scope-action",
            icon: "Activity",
          },
        ],
      },
    ];
  } else {
    return [];
  }
};
