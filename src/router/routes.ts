import { lazy } from "react";
import type { RouteType } from "@/types";

// Lazy load pages
const DashboardPage = lazy(() => import("../views/admin-pages/dashboard"));
const LoginPage = lazy(() => import("../views/admin-pages/login"));
const NotFoundPage = lazy(() => import("../views/admin-pages/not-found"));
const RelationshipManagersPage = lazy(
  () => import("../views/admin-pages/relationship-managers"),
);
const AddRMPage = lazy(
  () => import("../views/admin-pages/relationship-managers/AddRmForm"),
);

const ClientListPage = lazy(() => import("../views/admin-pages/client-list"));
const EditClientPage = lazy(
  () => import("../views/admin-pages/client-list/EditClient"),
);

const ManageParametersPage = lazy(
  () => import("../views/admin-pages/manage-parameters"),
);
const AddParameterPage = lazy(
  () => import("../views/admin-pages/manage-parameters/AddParameter"),
);

const ManageWeightagePage = lazy(
  () => import("../views/admin-pages/manage-weightage"),
);

const UserProfilePage = lazy(
  () => import("../views/admin-pages/profile"),
);

// ** Lazy Icons
const DashboardIcon = lazy(() => import("../views/components/icons/Dashboard"));
const RelationshipManagersIcon = lazy(
  () => import("../views/components/icons/RelationshipManager"),
);
const ClientListIcon = lazy(
  () => import("../views/components/icons/ClientList"),
);
const ManageParametersIcon = lazy(
  () => import("../views/components/icons/ManageParameters"),
);
const ManageWeightageIcon = lazy(
  () => import("../views/components/icons/ManageWeightage"),
);

export const routes: RouteType[] = [
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
    permission: "dashboard:page",
    group: "Main",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    path: "/relationship-managers",
    component: RelationshipManagersPage,
    layout: "default",
    permission: "relationship-managers:page",
    group: "Main",
    label: "Relationship Managers",
    icon: RelationshipManagersIcon,
  },
  {
    path: "/relationship-managers/add-rm",
    component: AddRMPage,
    layout: "default",
    permission: "add-rm:page",
    group: "Children",
    label: "Add User",
  },
  {
    path: "/relationship-managers/edit-rm/:rmId",
    component: AddRMPage,
    layout: "default",
    permission: "edit-rm:page",
    group: "Children",
    label: "Edit User",
  },
  {
    path: "/client-list",
    component: ClientListPage,
    layout: "default",
    permission: "client-list:page",
    group: "Main",
    label: "Client List",
    icon: ClientListIcon,
  },
  {
    path: "/client-list/edit-client/:clientId",
    component: EditClientPage,
    layout: "default",
    permission: "edit-client:page",
    group: "Children",
    label: "Edit Client",
  },
  {
    path: "/manage-parameters",
    component: ManageParametersPage,
    layout: "default",
    permission: "manage-parameters:page",
    group: "Main",
    label: "Manage Parameters",
    icon: ManageParametersIcon,
  },
  {
    path: "/manage-parameters/add-parameter",
    component: AddParameterPage,
    layout: "default",
    permission: "add-parameter:page",
    group: "Children",
    label: "Add Parameter",
  },
  {
    path: "/manage-parameters/edit-parameter/:editParamId",
    component: AddParameterPage,
    layout: "default",
    permission: "edit-parameter:page",
    group: "Children",
    label: "Edit Parameter",
  },
  {
    path: "/manage-weightage",
    component: ManageWeightagePage,
    layout: "default",
    permission: "manage-weightage:page",
    group: "Main",
    label: "Manage Weightage",
    icon: ManageWeightageIcon,
  },
  {
    path: "/manage-weightage/industry",
    component: ManageParametersPage,
    layout: "default",
    permission: "manage-industry-weightage:page",
    group: "Children",
    label: "Manage Industry Weightage",
  },
  {
    path: "/profile",
    component: UserProfilePage,
    layout: "other",
    permission: "profile:page",
    group: "Main",
    label: "Profile",
  }
];

export const SidebarRoutes: RouteType[] = routes.filter(
  (route) => route.layout === "default" && route.group === "Main",
);

export const validateRoutes = (routes: RouteType[]): void => {
  routes.forEach((route) => {
    if (!route.path || !route.component) {
      console.error(
        `Invalid route: ${JSON.stringify(route)}. Path and component are required.`,
      );
    }
  });
};

validateRoutes(routes);
