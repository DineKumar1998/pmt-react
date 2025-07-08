import AuthContext from "@/context/AuthContext";
import { AdminPermissions, RMPermissions } from "@/libs/permissions";
import { useContext } from "react";


const rmPermissions = [
    RMPermissions.ALL_ACTIONS,
    RMPermissions.DASHBOARD_READ,
    RMPermissions.DASHBOARD_ADMIN_CARD,
    RMPermissions.DASHBOARD_INDUSTRY_CARD,
    RMPermissions.DASHBOARD_PROJECT_STATUS_CARD,
    RMPermissions.DASHBOARD_RECENT_ACTIVITY_CARD,
    RMPermissions.DASHBOARD_RECENT_ASSIGNED_CARD,
    RMPermissions.CLIENTS_READ,
    RMPermissions.CLIENT_CREATE,
    RMPermissions.CLIENT_UPDATE,
    RMPermissions.CLIENT_DELETE,
    RMPermissions.USER_READ,
    RMPermissions.USER_UPDATE
]

const adminPermissions=[
    AdminPermissions.ALL_ACTIONS,
    AdminPermissions.DASHBOARD_READ,
    AdminPermissions.DASHBOARD_ADMIN_CARD,
    AdminPermissions.DASHBOARD_MEMBER_CARD,
    AdminPermissions.DASHBOARD_INDUSTRY_CHART,
    AdminPermissions.DASHBOARD_RECENT_CLEINTS_CARD,
    AdminPermissions.RM_READ,
    AdminPermissions.RM_CREATE,
    AdminPermissions.RM_UPDATE,
    AdminPermissions.RM_DELETE,
    AdminPermissions.CLIENT_READ,
    AdminPermissions.CLIENT_CREATE,
    AdminPermissions.CLIENT_UPDATE,
    AdminPermissions.CLIENT_DELETE,
    AdminPermissions.WEIGHTAGE_READ,
    AdminPermissions.WEIGHTAGE_CREATE,
    AdminPermissions.WEIGHTAGE_UPDATE,
    AdminPermissions.WEIGHTAGE_DELETE,
    AdminPermissions.PARAMETER_READ,
    AdminPermissions.PARAMETER_CREATE,

]

const usePermissions = () => {
  const {user} = useContext(AuthContext)
  const permissions: string[] = user.user_type === "RM" ? rmPermissions : adminPermissions;

  const hasPermission = (permission: any) => {
    return permissions.includes(permission);
  };

  return {
    hasPermission,
    permissions,
  };
};

export default usePermissions;
