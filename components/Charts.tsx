"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

// ------------------------------------------------------------
// Charts Component
// Renders:
// 1. Bar Chart - Vehicle Speeds
// 2. Pie Chart - Risk Level Distribution
// ------------------------------------------------------------

interface ChartsProps {
  vehicleSpeeds: { id: number; speed: number }[]; // e.g. [{id: 1, speed: 46}, ...]
  riskPercentage: number; // e.g. 78
}

export default function Charts({ vehicleSpeeds, riskPercentage }: ChartsProps) {
  // ---------------- Bar Chart Data (Vehicle Speeds) ----------------
  const barData = {
    labels: vehicleSpeeds.map((v) => `Vehicle ${v.id}`),
    datasets: [
      {
        label: "Speed (km/h)",
        data: vehicleSpeeds.map((v) => v.speed),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Vehicle Speeds",
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Speed (km/h)" },
      },
    },
  };

  // ---------------- Pie Chart Data (Risk Level) ----------------
  const safePercentage = 100 - riskPercentage;

  const pieData = {
    labels: ["Risk", "Safe Margin"],
    datasets: [
      {
        data: [riskPercentage, safePercentage],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: "Risk Level",
        font: { size: 14 },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="card flex flex-col items-center">
        <div className="w-full max-w-xs">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
