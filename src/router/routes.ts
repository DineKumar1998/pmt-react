// import type { RouteType } from "@/types";
// import { adminRoutes } from "./adminRoutes";
// import { rmPortalRoutes } from "./rmRoutes";
// import useAuth from "@/hooks/useAuth";
// // Lazy load pages
// const { type } = useAuth()

// export const routes = type === "RM" ? rmPortalRoutes : adminRoutes;
// export const SidebarRoutes: RouteType[] = routes.filter(
//   (route) => route.layout === "default" && route.group === "Main",
// );

// export const validateRoutes = (routes: RouteType[]): void => {

//   routes.forEach((route) => {
//     if (!route.path || !route.component) {
//       console.error(
//         `Invalid route: ${JSON.stringify(route)}. Path and component are required.`,
//       );
//     }
//   });
// };

// validateRoutes(routes);
