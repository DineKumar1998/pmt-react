import type { RouteType } from "@/types/routes";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../views/rm-pages/dashboard"));
const LoginPage = lazy(() => import("../views/admin-pages/login"));
const NotFoundPage = lazy(() => import("../views/admin-pages/not-found"));

const ClientListPage = lazy(() => import("../views/rm-pages/member-list"));
const EditClientPage = lazy(
  () => import("../views/rm-pages/member-list/EditClient")
);

const UserProfilePage = lazy(() => import("../views/admin-pages/profile"));

// ** Lazy Icons
const DashboardIcon = lazy(() => import("../views/components/icons/Dashboard"));

const ClientListIcon = lazy(
  () => import("../views/components/icons/ClientList")
);
const ClientParameters = lazy(
  () => import("../views/rm-pages/member-list/Parameters")
);

export const rmPortalRoutes: RouteType[] = [
  {
    path: "/login",
    component: LoginPage,
    layout: "auth",
  },
  {
    path: "/404",
    component: NotFoundPage,
    layout: "auth",
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    layout: "default",
    permission: "dashboard:read",
    group: "Main",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    path: "/members-list",
    component: ClientListPage,
    layout: "default",
    permission: "client:read",
    group: "Main",
    label: "Company List",
    icon: ClientListIcon,
  },
  {
    path: "/members-list/edit-client/:clientId",
    component: EditClientPage,
    layout: "default",
    permission: "client:update",
    group: "Children",
    label: "Edit Client",
  },
  {
    path: "/members-list/:memberName",
    component: lazy(() => import("../views/rm-pages/member-list/Projects")),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Clients Projects",
  },
   {
    path: "/members-list/:memberName/:projectName",
    component: lazy(() => import("../views/rm-pages/member-list/ProjectMCI")),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Projects MCIs",
  },
  {
    path: "/members-list/:memberName/parameters",
    component: ClientParameters,
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Clients Parameters",
  },
  {
    path: "/members-list/:memberName/:editParamId/edit",
    component: lazy(() => import("../views/rm-pages/manage-parameters/EditParameter")),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Parameter Update",
  },
  {
    path: "/profile",
    component: UserProfilePage,
    layout: "other",
    permission: "user:read",
    group: "Main",
    label: "Profile",
  },
];
