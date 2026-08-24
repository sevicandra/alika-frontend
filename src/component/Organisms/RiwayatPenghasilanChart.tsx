"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: { display: false },
    legend: {
      labels: { usePointStyle: true },
      display: false,
    },
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

type DataSeries = {
  label: string;
  data: number[];
  backgroundColor: string;
};

// ────────────────────────────────────────────────────────────
// RIWAYAT PENGHASILAN CHART — Organism
// Nama diperbaiki: Chart (bukan Cart) + PascalCase.
// File lama (riwayatPenghasilanCart.tsx) menjadi re-export.
// ────────────────────────────────────────────────────────────
export default function RiwayatPenghasilanChart({
  data,
}: {
  data: {
    bulan: string;
    gaji: number;
    tukin: number;
    umak: number;
    lembur: number;
  }[];
}) {
  const labels: string[] = [];
  const gaji: DataSeries = {
    label: "Gaji Pokok",
    data: [],
    backgroundColor: "rgb(255, 99, 132)",
  };
  const tukin: DataSeries = {
    label: "Tunjangan Kinerja",
    data: [],
    backgroundColor: "rgb(75, 192, 192)",
  };
  const umak: DataSeries = {
    label: "Uang Makan",
    data: [],
    backgroundColor: "rgb(255, 205, 86)",
  };
  const lembur: DataSeries = {
    label: "Uang Lembur",
    data: [],
    backgroundColor: "rgb(53, 162, 235)",
  };

  data.forEach((item) => {
    if (
      item.gaji != 0 ||
      item.tukin != 0 ||
      item.umak != 0 ||
      item.lembur != 0
    ) {
      labels.push(item.bulan);
      gaji.data.push(item.gaji);
      tukin.data.push(item.tukin);
      umak.data.push(item.umak);
      lembur.data.push(item.lembur);
    }
  });

  const datasets = {
    labels,
    datasets: [gaji, tukin, umak, lembur],
  };

  return <Bar options={options} data={datasets} className="w-full" />;
}
