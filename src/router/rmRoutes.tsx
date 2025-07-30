import type { RouteType } from "@/types/routes";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../views/rm-pages/dashboard"));
const LoginPage = lazy(() => import("../views/admin-pages/login"));
const NotFoundPage = lazy(() => import("../views/admin-pages/not-found"));

const ClientListPage = lazy(() => import("../views/rm-pages/client-list"));
const EditClientPage = lazy(
  () => import("../views/rm-pages/client-list/EditClient")
);

const UserProfilePage = lazy(() => import("../views/admin-pages/profile"));

// ** Lazy Icons
const DashboardIcon = lazy(() => import("../views/components/icons/Dashboard"));

const ClientListIcon = lazy(
  () => import("../views/components/icons/ClientList")
);
const ClientProjects = lazy(
  () => import("../views/rm-pages/client-list/Projects")
);
const ClientParameters = lazy(
  () => import("../views/rm-pages/client-list/Parameters")
);
const EditParameter = lazy(
  () => import("../views/rm-pages/manage-parameters/EditParameter")
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
    path: "/client-list",
    component: ClientListPage,
    layout: "default",
    permission: "client:read",
    group: "Main",
    label: "Member List",
    icon: ClientListIcon,
  },
  {
    path: "/client-list/edit-client/:clientId",
    component: EditClientPage,
    layout: "default",
    permission: "client:update",
    group: "Children",
    label: "Edit Client",
  },
  {
    path: "/client-list/projects/:id",
    component: ClientProjects,
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Clients Projects",
  },
  {
    path: "/client-list/parameters",
    component: ClientParameters,
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Clients Parameters",
  },
  {
    path: "/client-list/edit-parameter/:editParamId",
    component: EditParameter,
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
