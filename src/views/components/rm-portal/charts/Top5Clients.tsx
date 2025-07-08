import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
// import RedirectForward from "../../icons/RedirectForward";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Define the center text plugin
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart: any) {
    const { ctx, data } = chart;
    const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
    
    // Get center position
    const x = chart.getDatasetMeta(0).data[0]?.x;
    const y = chart.getDatasetMeta(0).data[0]?.y;
    
    if (x === undefined || y === undefined) return;
    
    // Draw text in center
    ctx.save();
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), x, y);
    ctx.restore();
  }
};

export default function RelationshipManagersChart({ record }: any) {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];

  let rmNamesList: string[] = [];
  let rmDataList: number[] = [];
  if (record?.total) {
    rmNamesList = record.data.map(({ name }: { name: string }) =>
      `${name}`.trim()
    );
    rmDataList = record.data.map(
      ({ clientCount }: { clientCount: number }) => clientCount
    );
  }

  const data = {
    labels: rmNamesList,
    datasets: [
      {
        data: rmDataList,
        backgroundColor: [
          "#C4F1F9",
          "#FBB6CE",
          "#FED7AA",
          "#C6F6D5",
          "#BEE3F8",
        ],
        borderWidth: 0,
        cutout: "65%", // For doughnut hole size
      },
    ],
  };

  const options: any = {
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
      },
      datalabels: {
        clip: false,
        color: "#000",
        anchor: "end",
        align: "end",
        offset: 10,
        font: {
          weight: "light",
          size: 16,
        },
        formatter: (_value: any, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return label.split(" ")[0]; // Stack label and value
        },
      },
    },
  };

  // const openRmPage = () => {
  //   navigate(`/relationship-managers`);
  // };

  return record?.total ? (
    <div className="card rm-relationship-managers-chart ">
      <div className="content">
        <p style={{ lineHeight: 0.8 }}>{t.text.totalClients} </p>
        <p>{record.total}</p>
      </div>
      <div className="chart">
        <Doughnut 
          data={data} 
          options={options} 
          plugins={[ChartDataLabels, centerTextPlugin]} 
        />
      </div>
      {/* <span
        className="redirect-icon"
        onClick={openRmPage}
        style={{ bottom: "0.5rem", right: "1rem" }}
      >
        <RedirectForward width={28} height={28} />
      </span> */}
    </div>
  ) : null;
}