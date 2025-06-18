import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ["Client", "Partners"],
  datasets: [
    {
      data: [30, 470],
      backgroundColor: ["#DCEBFA", "#97A9C9"],
      borderWidth: 0,
    },
  ],
};

const options: any = {
  // layout: {
  //   padding: {
  //     top: 20,
  //     bottom: 30,
  //     left: 50,
  //     right: 0,
  //   },
  // },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "#000",
      font: {
        weight: "bold",
        size: 18,
      },
      formatter: (value: number) => value,
    },
  },
};

export default function TotalMemberChart() {
  return (
    <div className="card total-members-chart">
      <div>
        <p>Total Members</p>
        <h3>500</h3>
        <div>
          <p className="client-dot">
            Client <strong style={{ display: "block" }}>30</strong>
          </p>
          <p className="partner-dot">
            Partners <strong style={{ display: "block" }}>470</strong>
          </p>
        </div>
      </div>
      <div className="chart">
        <Pie data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}
