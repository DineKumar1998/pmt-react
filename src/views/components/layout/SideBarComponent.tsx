import { NavLink } from "react-router-dom";

// import { s } from "@/router/routes";
import usePermissions from "@/hooks/usePermissions";
import { useAppRoutes } from "@/hooks/useRoutes";
import { useBreadcrumbs } from "@/context/Breadcrumb";

const LayoutSidebar = () => {
  const { hasPermission } = usePermissions();
  const { sidebarRoutes } = useAppRoutes();
  const { addBreadcrumb } = useBreadcrumbs();

  return (
    <>
      <div className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <h1>PI3 - PMT</h1>
        </NavLink>

        <ul className="sidebar-list">
          {sidebarRoutes.filter((route) => hasPermission(route.permission)).map((route) => {
            if (route.label?.length === 0) return null;
            return (
              <NavLink
                to={route.path}
                key={route.path}
                className="sidebar-link"
                onClick={() => {
                  // addBreadcrumb({ label: 'Dashboard' || "", path: '/dashboard' })
                  addBreadcrumb({ label: route.label || "", path: route.path })
                }}
              >
                <li className="sidebar-item">
                  {route.icon && <route.icon />}
                  <span>{route.label}</span>
                </li>
              </NavLink>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LayoutSidebar;
