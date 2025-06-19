"use server";
export type MenuType = {
  title: string | undefined;
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
        ],
      },
      {
        title: "Bagian SDM",
        data: [
          {
            label: "Dashboard",
            path: "/mutasi/sdm/dashboard",
            icon: "LayoutDashboard",
          },
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
            label: "Monitoring Dokumen",
            path: "/mutasi/sdm/monitoring",
            icon: "SearchCheck",
          },
          {
            label: "Monitoring Pembayaran",
            path: "/mutasi/sdm/pembayaran",
            icon: "Landmark",
          },
          {
            label: "Arsip",
            path: "/mutasi/sdm/arsip",
            icon: "Archive",
          },
        ],
      },
    ];
  } else {
    return [];
  }
};
