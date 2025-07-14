import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useQuery } from '@tanstack/react-query';
import { getTop5RM } from "@/apis/rm"
import RedirectForward from "../icons/RedirectForward";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


export default function RelationshipManagersChart() {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const listLimit = 5;
  const navigate = useNavigate();


  const { data: rmList } = useQuery({
    queryKey: ['rmList', selectedLang],
    queryFn: () =>
      getTop5RM({ limit: listLimit, language: selectedLang }),
  });

  let rmNamesList: string[] = [];
  let rmDataList: number[] = [];
  if (rmList?.length) {
    rmNamesList = rmList.map(
      ({
        first_name,
        last_name,
      }: {
        first_name: string;
        last_name?: string | null;
      }) => (`${first_name} ${(last_name ?? '').trim()}`.trim())
    );
    rmDataList = rmList.map(
      ({
        clients_assigned_count
      }: {
        clients_assigned_count: number;
      }) => (clients_assigned_count)
    );
  }

  const data = {
    labels: rmNamesList,
    datasets: [
      {
        data: rmDataList,
        backgroundColor: ["#C4F1F9", "#FBB6CE", "#FED7AA", "#C6F6D5", "#BEE3F8"],
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
        formatter: (_value: any, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return label.split(" ")[0]; // Stack label and value
        },
      },
    },
  };

  const openRmPage = () => {
    navigate(`/relationship-managers`)
  }

  return (
    <div className="card relationship-managers-chart">
      <div>
        <p style={{ lineHeight: 0.8 }}>{t.text.relationship} </p>
        <p>{t.text.managers}</p>
        <h3>{t.text.top5}</h3>
      </div>
      <div className="chart">
        <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
      <span
        className="redirect-icon"
        onClick={openRmPage}
        style={{ bottom: "0.5rem", right: "1rem" }}
      >
        <RedirectForward width={28} height={28} />
      </span>
    </div>
  );
}
