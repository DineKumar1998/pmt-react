import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = [
  "Electronics",
  "Textiles",
  "Automotive",
  "Manufacturing",
  "Architecture",
];

const primaryData = [78, 70, 70, 80, 80];
const secondaryData = [70, 53, 59, 62, 70];

export const options = {
  layout: {
    padding: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 40, // Extra padding on the right for datalabels
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true, // Show legend
      position: "left",
      labels: {
        font: {
          size: 14,
          family: "Arial, sans-serif",
        },
        boxWidth: 20,
        padding: 15,
      },
    },
    tooltip: {
      disabled: false, // Enable tooltips
    },

    datalabels: {
      anchor: "end",
      align: "end",
      formatter: (value: number) => `${value}%`,
      color: "#333",
      font: {
        size: 12,
        family: "Arial, sans-serif",
      },
      padding: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: any) => `${value}%`,
        stepSize: 10,
      },
      grid: {
        drawBorder: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const data = {
  labels,
  datasets: [
    {
      label: "Primary",
      data: primaryData,
      backgroundColor: "#CCF7C4",
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    },
    {
      label: "Secondary",
      data: secondaryData,
      backgroundColor: "#FEE6DC",
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    },
  ],
};

export default function CompletionStatusChart() {
  return (
    <div className="completion-status-chart">
      <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Completion Status (%)
      </h4>
      <div className="chart">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
