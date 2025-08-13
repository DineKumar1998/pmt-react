import type { RouteType } from "@/types/routes";
import { lazy } from "react";

export const adminRoutes: RouteType[] = [
  {
    path: "/login",
    component: lazy(() => import("../views/admin-pages/login")),
    layout: "auth",
  },
  {
    path: "/404",
    component: lazy(() => import("../views/admin-pages/not-found")),
    layout: "auth",
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../views/admin-pages/dashboard")),
    layout: "default",
    permission: "dashboard:read",
    group: "Main",
    label: "Dashboard",
    icon: lazy(() => import("../views/components/icons/Dashboard")),
  },
  {
    path: "/relationship-managers",
    component: lazy(() => import("../views/admin-pages/relationship-managers")),
    layout: "default",
    permission: "rm:read",
    group: "Main",
    label: "Relationship Managers",
    icon: lazy(() => import("../views/components/icons/RelationshipManager")),
  },
  {
    path: "/relationship-managers/add",
    component: lazy(
      () => import("../views/admin-pages/relationship-managers/AddRmForm")
    ),
    layout: "default",
    permission: "rm:create",
    group: "Children",
    label: "Add User",
  },
  {
    path: "/relationship-managers/edit",
    component: lazy(
      () => import("../views/admin-pages/relationship-managers/AddRmForm")
    ),
    layout: "default",
    permission: "rm:update",
    group: "Children",
    label: "Edit User",
  },
  {
    path: "/relationship-managers/member-edit",
    component: lazy(
      () => import("../views/admin-pages/member-list/EditClient")
    ),
    layout: "default",
    permission: "rm:update",
    group: "Children",
    label: "Edit User",
  },
  {
    path: "/relationship-managers/:rmName",
    component: lazy(
      () => import("../views/admin-pages/relationship-managers/RmClientsPage")
    ),
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "RM",
  },
  {
    path: "/relationship-managers/:rmName/:memberName",
    component: lazy(
      () => import("../views/admin-pages/relationship-managers/ClientProjects")
    ),
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "Client Projects",
  },
  {
    path: "/relationship-managers/:rmName/:memberName/:projectName",
    component: lazy(
      () => import("../views/admin-pages/member-list/ProjectMCI")
    ),
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "Project MCI",
  },
  {
    path: "/relationship-managers/:rmName/:memberName/parameters",
    component: lazy(
      () =>
        import(
          "../views/admin-pages/relationship-managers/ManageClientParameters"
        )
    ),
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "Manage Company Parameters",
  },
  {
    path: "/relationship-managers/:rmName/:memberName/parameters/:paramId",
    component: lazy(
      () =>
        import("../views/admin-pages/relationship-managers/EditClientParameter")
    ),
    layout: "default",
    permission: "rm:read",
    group: "Children",
    label: "Manage Company Parameters",
  },

  // *****************  Memeber List  ***************** /

  {
    path: "/member-list",
    component: lazy(() => import("../views/admin-pages/member-list")),
    layout: "default",
    permission: "client:read",
    group: "Main",
    label: "Company List",
    icon: lazy(() => import("../views/components/icons/ClientList")),
  },
  {
    path: "/member-list/edit",
    component: lazy(
      () => import("../views/admin-pages/member-list/EditClient")
    ),
    layout: "default",
    permission: "client:update",
    group: "Children",
    label: "Edit Client",
  },
  {
    path: "/member-list/:memberName",
    component: lazy(
      () => import("../views/admin-pages/member-list/ClientProjects")
    ),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Client Projects",
  },
  {
    path: "/member-list/:memberName/:projectName",
    component: lazy(
      () => import("../views/admin-pages/member-list/ProjectMCI")
    ),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Project MCI",
  },
  {
    path: "/member-list/:memberName/parameters",
    component: lazy(
      () => import("../views/admin-pages/member-list/ManageClientParameters")
    ),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Manage Member Parameters",
  },
  {
    path: "/member-list/:memberName/parameters/:paramId",
    component: lazy(
      () => import("../views/admin-pages/member-list/EditClientParameter")
    ),
    layout: "default",
    permission: "client:read",
    group: "Children",
    label: "Edit Member Parameters",
  },

  // *****************  Manage Parameters  ***************** /
  {
    path: "/manage-parameters",
    component: lazy(() => import("../views/admin-pages/manage-parameters")),
    layout: "default",
    permission: "parameter:read",
    group: "Main",
    label: "Manage Parameters",
    icon: lazy(() => import("../views/components/icons/ManageParameters")),
  },
  {
    path: "/manage-parameters/:editParamId",
    component: lazy(
      () =>
        import("../views/admin-pages/manage-parameters/parameter/EditParameter")
    ),
    layout: "default",
    permission: "parameter:update",
    group: "Children",
    label: "Edit Parameter",
  },
  {
    path: "/manage-parameters/client",
    component: lazy(
      () =>
        import("../views/admin-pages/manage-parameters/ManageClientParameters")
    ),
    layout: "default",
    permission: "parameter:read",
    group: "Children",
    label: "Manage Client Parameters",
  },
  {
    path: "/manage-parameters/client/edit-parameter/:editParamId",
    component: lazy(
      () => import("../views/admin-pages/manage-parameters/EditClientParameter")
    ),
    layout: "default",
    permission: "parameter:update",
    group: "Children",
    label: "Edit Client Parameters",
  },
  {
    path: "/manage-parameters/:parameterId/industry-map",
    component: lazy(
      () => import("../views/admin-pages/manage-parameters/IndustryMapView")
    ),
    layout: "default",
    permission: "parameter:update",
    group: "Children",
    label: "Industry",
  },
  {
    path: "/manage-parameters/add-parameter",
    component: lazy(
      () =>
        import("../views/admin-pages/manage-parameters/parameter/AddParameter")
    ),
    layout: "default",
    permission: "parameter:create",
    group: "Children",
    label: "Add Parameter",
  },

  {
    path: "/manage-weightage",
    component: lazy(() => import("../views/admin-pages/manage-weightage")),
    layout: "default",
    permission: "weightage:read",
    group: "Main",
    label: "Manage Weightage",
    icon: lazy(() => import("../views/components/icons/ManageWeightage")),
  },
  {
    path: "/manage-weightage/:industryName",
    component: lazy(
      () => import("../views/admin-pages/manage-weightage/Parameter")
    ),
    layout: "default",
    permission: "manage-industry-weightage:page",
    group: "Children",
    label: "Manage Industry Weightage",
  },
  {
    path: "/manage-weightage/client",
    component: lazy(() => import("../views/admin-pages/manage-parameters")),
    layout: "default",
    permission: "manage-industry-weightage:page",
    group: "Children",
    label: "Manage Client Weightage",
  },
  {
    path: "/profile",
    component: lazy(() => import("../views/admin-pages/profile")),
    layout: "other",
    permission: "user:read",
    group: "Main",
    label: "Profile",
  },
];
