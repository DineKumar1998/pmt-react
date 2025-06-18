import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: [
    "Kugisaki Naruto",
    "Fushiguro Nobara",
    "Itadori Megumi",
    "Satoru GojoYuji",
    "Uzumaki Kakashi",
  ],
  datasets: [
    {
      data: [7, 4, 5, 5, 6],
      backgroundColor: ["#C4F1F9", "#FBB6CE", "#FED7AA", "#C6F6D5", "#BEE3F8"],
      borderWidth: 0,
      cutout: "65%", // For doughnut hole size
    },
  ],
};

const options = {
  layout: {
    padding: {
      top: 40,
      bottom: 50,
      left: 50,
      right: 50,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      cutout: "60%",
    },

    datalabels: {
      clip: false,
      color: "#000",
      anchor: "end",
      align: "end",
      offset: 10,
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value, context) => {
        const label = context.chart.data.labels[context.dataIndex];
        return label.split(" ")[0]; // Stack label and value
      },
    },
  },
};

export default function RelationshipManagersChart() {
  return (
    <div className="card relationship-managers-chart">
      <div>
        <p style={{ lineHeight: 0.8 }}>Relationship </p>
        <p>Managers</p>
        <h3>Top 5</h3>
      </div>
      <div className="chart">
        <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}
