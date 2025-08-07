import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";

export interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  trimBreadcrumbs: (path: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

const STORAGE_KEY = "app-breadcrumbs";

const DASHBOARD_BREADCRUMB: BreadcrumbItem = {
  label: "Dashboard",
  path: "/dashboard",
};

const stripQueryParams = (search: string, keysToStrip: string[]) => {
  const params = new URLSearchParams(search);
  keysToStrip.forEach((key) => params.delete(key));
  const stripped = params.toString();
  return stripped ? `?${stripped}` : "";
};

const getPathWithoutQuery = (url: string): string => {
  return url.split("?")[0];
};

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const hasDashboard = parsed.some((b:BreadcrumbItem) => b.path === DASHBOARD_BREADCRUMB.path);
    return hasDashboard ? parsed : [DASHBOARD_BREADCRUMB, ...parsed];
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);

  const ensureDashboardIncluded = useCallback((items: BreadcrumbItem[]) => {
    const hasDashboard = items.some(b => b.path === DASHBOARD_BREADCRUMB.path);
    return hasDashboard ? items : [DASHBOARD_BREADCRUMB, ...items];
  }, []);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs((prev) => {
      if (prev.some((b) => b.path === item.path)) return prev;
      return ensureDashboardIncluded([...prev, item]);
    });
  }, [ensureDashboardIncluded]);

  const trimBreadcrumbs = useCallback((currentPath: string) => {
    setBreadcrumbs((prev) => {
      const trimmed = prev.filter((b) => {
        const bPath = getPathWithoutQuery(b.path);
        const cPath = getPathWithoutQuery(currentPath);
        return cPath.startsWith(bPath);
      });
      return ensureDashboardIncluded(trimmed);
    });
  }, [ensureDashboardIncluded]);

  const remUnusedBreadcrumbs = useCallback((currentPath: string) => {
    setBreadcrumbs((prev) => {
      const currentPathNoQuery = getPathWithoutQuery(currentPath);
      const currentIndex = prev.findIndex(
        (b) => getPathWithoutQuery(b.path) === currentPathNoQuery
      );
      const sliced = currentIndex !== -1 ? prev.slice(0, currentIndex + 1) : prev;
      return ensureDashboardIncluded(sliced);
    });
  }, [ensureDashboardIncluded]);

  useEffect(() => {
    const cleanSearch = stripQueryParams(location.search, ["tab"]);
    const currentPath = location.pathname + cleanSearch;

    trimBreadcrumbs(currentPath);
    remUnusedBreadcrumbs(currentPath);
  }, [location.pathname, location.search, trimBreadcrumbs, remUnusedBreadcrumbs]);

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, addBreadcrumb, trimBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context)
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  return context;
};
