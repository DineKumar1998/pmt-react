import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import RedirectForward from "../icons/RedirectForward";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type IndustriesStatsType = {
  id: number;
  name: string;
  primaryPercentage: number;
  secondaryPercentage: number;
}

type ChartProps = {
  industriesStats: {
    stats: IndustriesStatsType[],
    totalParametersCount: number,
    totalPrimaryCount: number,
    totalSecondaryCount: number
  };
};

export default function CompletionStatusChart({ industriesStats }: ChartProps) {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const navigate = useNavigate();

  const labels: string[] = [];
  const primaryData: number[] = [];
  const secondaryData: number[] = [];

  industriesStats?.stats?.forEach((industry: IndustriesStatsType) => {
    labels.push(industry.name ?? "")
    primaryData.push(industry.primaryPercentage ?? 0)
    secondaryData.push(industry.secondaryPercentage ?? 0)
  });


  const options: any = {
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
        display: false, // Show legend
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

  const primaryLabelColor = "#CCF7C4";
  const secondaryLabelColor = "#FEE6DC";

  const data = {
    labels,
    datasets: [
      {
        label: t.buttons.primary,
        data: primaryData,
        backgroundColor: primaryLabelColor,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        label: t.buttons.secondary,
        data: secondaryData,
        backgroundColor: secondaryLabelColor,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const openManageWeightagePage = () => {
    navigate(`/manage-weightage`)
  }

  return (
    <div className="completion-status-chart">
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>
        {t.text.completionStatus} (%)
      </p>

      <div className="chart-container">
        <div className="custom-legend">
          <div className="total-parameters-view">
            <p>{t.heading.parameter}</p>
            <strong>{industriesStats?.totalParametersCount ?? 0}</strong>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: primaryLabelColor }} />
            <span className="legend-label">{t.buttons.primary} <strong>{industriesStats?.totalPrimaryCount ?? 0}</strong></span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: secondaryLabelColor }} />
            <span className="legend-label">{t.buttons.secondary} <strong>{industriesStats?.totalSecondaryCount ?? 0}</strong></span>
          </div>
        </div>
        <div className="chart">
          <Bar data={data} options={options} />
        </div>
        <span className="redirect-icon"
          onClick={openManageWeightagePage}
          style={{ bottom: "-1rem", right: "-0.5rem" }}
        >
          <RedirectForward width={28} height={28} />
        </span>
      </div>
    </div>
  );
}
