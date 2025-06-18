import { lazy, Suspense } from "react";

const Top5RMCardChart = lazy(() => import("@/views/components/charts/Top5RM"));
const TotalMemberChart = lazy(
  () => import("@/views/components/charts/TotalMember"),
);
const IllustrationChart = lazy(
  () => import("@/views/components/charts/Illustration"),
);
const CompletionStatusChart = lazy(
  () => import("@/views/components/charts/CompletionStatus"),
);

import "./dashboard.scss";
import RecentClient from "./RecentClient";
import RecentRM from "./RecentRM";

const Dashboard = () => {
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
          <TotalMemberChart />
        </Suspense>
      </section>
      <CompletionStatusChart />

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
