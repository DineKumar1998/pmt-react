import { lazy, Suspense, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/apis/dashboard";

const Top5RMCardChart = lazy(() => import("@/views/components/charts/Top5RM"));
const TotalMemberChart = lazy(
  () => import("@/views/components/charts/TotalMember")
);
const IllustrationChart = lazy(
  () => import("@/views/components/charts/Illustration")
);
const CompletionStatusChart = lazy(
  () => import("@/views/components/charts/CompletionStatus")
);

import RecentClient from "./RecentClient";
import RecentRM from "./RecentRM";
import "./dashboard.scss";

const Dashboard = () => {
  const { selectedLang } = useLang();
  
  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats", selectedLang],
    queryFn: () => getDashboardStats({ language: selectedLang }),
  });

  return (
    <div className="dashboard-page">
      <section className="cards">
        <Suspense fallback={null}>
          <IllustrationChart />
        </Suspense>
        <Suspense fallback={null}>
          <Top5RMCardChart />
        </Suspense>
        <Suspense fallback={null}>
          <TotalMemberChart membersData={dashboardStats?.membersData} />
        </Suspense>
      </section>
      <CompletionStatusChart
        industriesStats={dashboardStats?.industriesStats}
      />

      <section className="recent-activity">
        <Suspense fallback={<div>Loading...</div>}>
          <RecentRM />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <RecentClient />
        </Suspense>
      </section>
    </div>
  );
};

export default Dashboard;
