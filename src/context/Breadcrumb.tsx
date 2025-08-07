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

// Define static route-to-label mapping
const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rm": "Relationship Manager",
  "/rm/clients": "Clients",
  "/rm/clients/add": "Add Client",
  "/rm/client/:id": "Client Details", // will be replaced dynamically
  "/rm/client/:id/projects": "Projects",
  "/rm/client/:id/settings": "Settings",
  // Add more as needed
};

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

// Extract dynamic segments and build breadcrumb path
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];

  let currentPath = "";

  for (const segment of pathSegments) {
    currentPath += `/${segment}`;

    // Try exact match first
    let label = ROUTE_LABELS[currentPath];

    // If not found, try pattern matching (for dynamic routes like /rm/client/123)
    if (!label) {
      const patternKey = Object.keys(ROUTE_LABELS).find((key) =>
        key.startsWith(currentPath.split("/").slice(0, -1).join("/")) &&
        key.includes(":")
      );
      label = patternKey ? ROUTE_LABELS[patternKey] : segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    // Skip duplicates or invalid
    if (!crumbs.some((crumb) => crumb.path === currentPath)) {
      crumbs.push({
        path: currentPath,
        label,
      });
    }
  }

  return crumbs;
};

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const parsed: BreadcrumbItem[] = stored ? JSON.parse(stored) : [];

    // Always ensure Dashboard is present
    const hasDashboard = parsed.some((b) => b.path === DASHBOARD_BREADCRUMB.path);
    return hasDashboard ? parsed : [DASHBOARD_BREADCRUMB];
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);

  const ensureDashboardIncluded = useCallback((items: BreadcrumbItem[]) => {
    const hasDashboard = items.some((b) => b.path === DASHBOARD_BREADCRUMB.path);
    return hasDashboard ? items : [DASHBOARD_BREADCRUMB, ...items];
  }, []);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs((prev) => {
      const exists = prev.some((b) => b.path === item.path);
      if (exists) return prev;
      const newCrumbs = [...prev, item];
      return ensureDashboardIncluded(newCrumbs);
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

  // 🔁 Reconstruct breadcrumbs on direct navigation
  useEffect(() => {
    const cleanSearch = stripQueryParams(location.search, ["tab"]);
    const currentPath = location.pathname + cleanSearch;

    setBreadcrumbs((prev) => {
      // If we already have full path in state, skip regeneration
      const pathExists = prev.some(
        (b) => getPathWithoutQuery(b.path) === getPathWithoutQuery(currentPath)
      );
      if (pathExists) {
        trimBreadcrumbs(currentPath);
        return prev;
      }

      // Otherwise, generate fresh breadcrumbs from current path
      const generated = generateBreadcrumbsFromPath(location.pathname);
      return ensureDashboardIncluded(generated);
    });
  }, [location.pathname, location.search, trimBreadcrumbs, ensureDashboardIncluded]);

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