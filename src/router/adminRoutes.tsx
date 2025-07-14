import type { RouteType } from "@/types/routes";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../views/admin-pages/dashboard"));
const LoginPage = lazy(() => import("../views/admin-pages/login"));
const NotFoundPage = lazy(() => import("../views/admin-pages/not-found"));
const RelationshipManagersPage = lazy(
  () => import("../views/admin-pages/relationship-managers"),
);
const AddRMPage = lazy(
  () => import("../views/admin-pages/relationship-managers/AddRmForm"),
);

const RmClientsPage = lazy(
  () => import("../views/admin-pages/client-list/RmClientsPage"),
);

const ClientProjects = lazy(
  () => import("../views/admin-pages/client-list/ClientProjects"),
);

const ClientListPage = lazy(() => import("../views/admin-pages/client-list"));
const EditClientPage = lazy(
  () => import("../views/admin-pages/client-list/EditClient"),
);

const ManageParametersPage = lazy(
  () => import("../views/admin-pages/manage-parameters"),
);

const ManageClientParametersPage = lazy(
  () => import("../views/admin-pages/manage-parameters/ManageClientParameters"),
);

const EditClientParameter = lazy(
  () => import("../views/admin-pages/manage-parameters/EditClientParameter"),
)

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

export const adminRoutes: RouteType[] = [
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
    path: "/relationship-managers",
    component: RelationshipManagersPage,
    layout: "default",
    permission: "rm:read",
    group: "Main",
    label: "Relationship Managers",
    icon: RelationshipManagersIcon,
  },
  {
    path: "/relationship-managers/add-rm",
    component: AddRMPage,
    layout: "default",
    permission: "rm:create",
    group: "Children",
    label: "Add User",
  },
  {
    path: "/relationship-managers/edit-rm/:rmId",
    component: AddRMPage,
    layout: "default",
    permission: "rm:update",
    group: "Children",
    label: "Edit User",
  },
  {
    path: "/relationship-managers/rm",
    component: RmClientsPage,
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "RM",
  },
  {
    path: "/client-list",
    component: ClientListPage,
    layout: "default",
    permission: "client:read",
    group: "Main",
    label: "Client List",
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
    path: "/client-list/projects",
    component: ClientProjects,
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Client Projects",
  },
  {
    path: "/manage-parameters",
    component: ManageParametersPage,
    layout: "default",
    permission: "parameter:read",
    group: "Main",
    label: "Manage Parameters",
    icon: ManageParametersIcon,
  },
  {
    path: "/manage-parameters/client",
    component: ManageClientParametersPage,
    layout: "default",
    permission: "parameter:read",
    group: "Children",
    label: "Manage Client Parameters",
  },
  {
    path: "/manage-parameters/client/edit-parameter/:editParamId",
    component: EditClientParameter,
    layout: "default",
    permission: "parameter:update",
    group: "Children",
    label: "Edit Client Parameters",
  },
  {
    path: "/manage-parameters/add-parameter",
    component: AddParameterPage,
    layout: "default",
    permission: "parameter:create",
    group: "Children",
    label: "Add Parameter",
  },
  {
    path: "/manage-parameters/edit-parameter/:editParamId",
    component: AddParameterPage,
    layout: "default",
    permission: "parameter:update",
    group: "Children",
    label: "Edit Parameter",
  },
  {
    path: "/manage-weightage",
    component: ManageWeightagePage,
    layout: "default",
    permission: "weightage:read",
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
    path: "/manage-weightage/client",
    component: ManageParametersPage,
    layout: "default",
    permission: "manage-industry-weightage:page",
    group: "Children",
    label: "Manage Client Weightage",
  },
  {
    path: "/profile",
    component: UserProfilePage,
    layout: "other",
    permission: "user:read",
    group: "Main",
    label: "Profile",
  }
];
