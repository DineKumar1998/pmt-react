import { lazy, Suspense } from "react";
import { useLang } from "@/context/LangContext";
import { useQuery } from "@tanstack/react-query";

const Top5RMCardChart = lazy(
  () => import("@/views/components/rm-portal/charts/Top5Clients")
);
const TotalProjectsChart = lazy(
  () => import("@/views/components/rm-portal/charts/TotalProjects")
);
const IllustrationChart = lazy(
  () => import("@/views/components/rm-portal/charts/Illustration")
);

import RecentAssigned from "./RecentAssigned";
import RecentActivity from "./RecentActivity";
import { getRMDashboardStats } from "@/apis/rm-portal/dashboard";
import "./dashboard.scss";

const Dashboard = () => {
  const { selectedLang } = useLang();

  const { data: dashboardStats } = useQuery({
    queryKey: ["rm-portal-dashboard", selectedLang],
    queryFn: () => getRMDashboardStats({ language: selectedLang }),
  });

  return (
    <div className="dashboard-page">
      <section className="cards">
        <Suspense fallback={null}>
          <IllustrationChart />
        </Suspense>
        <Suspense fallback={null}>
          <Top5RMCardChart record={dashboardStats?.client} />
        </Suspense>
        <Suspense fallback={null}>
          <TotalProjectsChart record={dashboardStats?.project} />
        </Suspense>
      </section>

      <section className="recent-activity">
        <Suspense fallback={<div>Loading...</div>}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <RecentAssigned />
        </Suspense>
      </section>
    </div>
  );
};

export default Dashboard;
