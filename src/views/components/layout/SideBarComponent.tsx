import { NavLink } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import { useAppRoutes } from "@/hooks/useRoutes";
import { useBreadcrumbs } from "@/context/Breadcrumb";

const LayoutSidebar = () => {
  const { hasPermission } = usePermissions();
  const { sidebarRoutes } = useAppRoutes();
  const { addBreadcrumb } = useBreadcrumbs();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  return (
    <>
      {/* <aside className={`sidebar ${isSidebarOpen ? "" : "sidebar-collapsed"}`}> */}
      <aside className={`sidebar`}>
        <div className="sidebar-header">
          {/* {isSidebarOpen ? ( */}
            <NavLink to="/dashboard" className="sidebar-logo">
              <h1>PI3 - PMT</h1>
            </NavLink>
          {/* ) : (
            <div className="sidebar-logo-collapsed">
              <span>P</span>
            </div>
          )} */}
          {/* <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? "◀" : "▶"}
          </button> */}
        </div>

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