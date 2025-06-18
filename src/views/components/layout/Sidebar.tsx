import { Link, NavLink } from "react-router-dom";

import { SidebarRoutes } from "@/router/routes";

const LayoutSidebar = () => {
  // const { permissions, adminPermission } = useMyPermissions();

  return (
    <>
      <div className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <h1>P-I cube</h1>
        </NavLink>

        <ul className="sidebar-list">
          {SidebarRoutes.map((route) => {
            if (route.label?.length === 0) return null;

            return (
              <NavLink
                to={route.path}
                key={route.path}
                className="sidebar-link"
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
