import { NavLink } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import { useAppRoutes } from "@/hooks/useRoutes";
import { useBreadcrumbs } from "@/context/Breadcrumb";
import { type FC } from "react";

type LayoutSidebarProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const LayoutSidebar: FC<LayoutSidebarProps> = (props: LayoutSidebarProps) => {
  const { hasPermission } = usePermissions();
  const { sidebarRoutes } = useAppRoutes();
  const { addBreadcrumb } = useBreadcrumbs();

  const { isSidebarOpen, toggleSidebar } = props;


  return (
    <>
      <aside className={`sidebar`}>
        <div className="sidebar-header">
          {/* {isSidebarOpen ? ( */}
          <NavLink to="/dashboard" className="sidebar-logo">
            {
              isSidebarOpen ? <h2>PI3 - PMT</h2> : <h1>PI3 - PMT</h1>
            }
          </NavLink>

        </div>

        <button type="button" onClick={toggleSidebar} id="resize" className={`sidebar-toggle`}>
          <span> &#9776;</span>
        </button>

        <ul className="sidebar-list">
          {sidebarRoutes
            .filter((route) => hasPermission(route.permission))
            .map((route) => {
              if (route.label?.length === 0) return null;
              return (
                <NavLink
                  to={route.path}
                  key={route.path}
                  className="sidebar-link"
                  onClick={() => {
                    addBreadcrumb({ label: route.label || "", path: route.path });
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
      </aside>
    </>
  );
};

export default LayoutSidebar;