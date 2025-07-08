// import useAuth from "@/hooks/useAuth";
import { rmPortalRoutes } from "@/router/rmRoutes";
import { adminRoutes } from "@/router/adminRoutes";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import type { RouteType } from "@/types/routes";

export const useAppRoutes = () => {
  //   const { type } = useAuth();
  const { user } = useContext(AuthContext);
  const routes = user.user_type === "RM" ? rmPortalRoutes : adminRoutes;

  const sidebarRoutes = routes.filter(
    (route) => route.layout === "default" && route.group === "Main"
  );

  const validateRoutes = (routes: RouteType[]): void => {
    routes.forEach((route) => {
      if (!route.path || !route.component) {
        console.error(
          `Invalid route: ${JSON.stringify(
            route
          )}. Path and component are required.`
        );
      }
    });
  };

  return { routes, sidebarRoutes, validateRoutes };
};
