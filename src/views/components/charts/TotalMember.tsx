import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import RedirectForward from "../icons/RedirectForward";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type MembersDataType = {
  clients: number;
  users: number;
  total: number;
};
type TotalMemberProps = {
  membersData: MembersDataType;
};

export default function TotalMemberChart({ membersData }: TotalMemberProps) {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const navigate = useNavigate();

  const data = {
    labels: [t.text.clients, t.text.partners],
    datasets: [
      {
        data: [membersData?.clients, membersData?.users],
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

  const openClientListPage = () => {
    navigate(`/client-list`)
  }

  return (
    <div className="card total-members-chart">
      <div>
        <p>{t.text.totalMembers}</p>
        <h3>{membersData?.total}</h3>
        <div>
          <p className="client-dot">
            {t.text.clients} <strong style={{ display: "block" }}>{membersData?.clients}</strong>
          </p>
          <p className="partner-dot">
            {t.text.partners}  <strong style={{ display: "block" }}>{membersData?.users}</strong>
          </p>
        </div>
      </div>
      <div className="chart">
        <Pie data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
      <span className="redirect-icon"
        onClick={openClientListPage}
        style={{ bottom: "0.5rem", right: "1rem" }}
      >
        <RedirectForward width={28} height={28} />
      </span>
    </div>
  );
}
