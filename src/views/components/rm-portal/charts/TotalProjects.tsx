import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import RedirectForward from "../../icons/RedirectForward";
import { NavLink } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type MembersDataType = {
  total: number;
  active: number;
  closed: number;
};
type TotalMemberProps = {
  record: MembersDataType;
};

export default function TotalMemberChart({ record }: TotalMemberProps) {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];

  const data = {
    labels: [t.text.active, t.text.closed],
    datasets: [
      {
        data: [record?.active || 0, record?.closed || 0],
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

  return (
    <div className="card total-members-chart">
      <div>
        <p>{t.text.totalMembers}</p>
        <h3>{record?.total}</h3>
        <div>
          <p className="client-dot">
            {t.text.active}{" "}
            <strong style={{ display: "block" }}>{record?.active}</strong>
          </p>
          <p className="partner-dot">
            {t.text.closed}{" "}
            <strong style={{ display: "block" }}>{record?.closed}</strong>
          </p>
        </div>
      </div>
      <div className="chart">
        <Pie data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
      <NavLink 
        to={`/members-list`}
        className="redirect-icon"
        style={{ bottom: "0.5rem", right: "1rem" }}
      >
        <RedirectForward width={28} height={28} />
      </NavLink>
    </div>
  );
}
