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
const normalizeLabel = (segment: string): string => {
  const decoded = decodeURIComponent(segment);
  
  // Explicitly handle NA case (both encoded and decoded)
  if (segment === 'NA' || decoded === 'NA') return 'NA';
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    'edit-rm': 'Edit',
    'create-new': 'Create',
    'view-all': 'View',
    'member-list': 'Company List'
  };
  
  return specialCases[decoded] || 
    decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
};
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

const STORAGE_KEY = "app-breadcrumbs";

const DASHBOARD_BREADCRUMB: BreadcrumbItem = {
  label: "Dashboard",
  path: "/dashboard",
};

// const stripQueryParams = (search: string, keysToStrip: string[]) => {
//   const params = new URLSearchParams(search);
//   // keysToStrip.forEach((key) => params.delete(key));
//   const stripped = params.toString();
//   return stripped ? `?${stripped}` : "";
// };

const getPathWithoutQuery = (url: string): string => {
  return url.split("?")[0];
};
// const getFullPath = (pathname: string, search: string): string => {
//   return pathname + search; // CHANGED: Now preserves all query parameters
// };

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const hasDashboard = parsed.some(
      (b: BreadcrumbItem) => b.path === DASHBOARD_BREADCRUMB.path
    );
    return hasDashboard ? parsed : [DASHBOARD_BREADCRUMB, ...parsed];
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);  

  const ensureDashboardIncluded = useCallback((items: BreadcrumbItem[]) => {
    const hasDashboard = items.some(
      (b) => b.path === DASHBOARD_BREADCRUMB.path
    );
    return hasDashboard ? items : [DASHBOARD_BREADCRUMB, ...items];
  }, []);

  const addBreadcrumb = useCallback(
    (item: BreadcrumbItem) => {
      setBreadcrumbs((prev) => {
        if (prev.some((b) => b.path === item.path)) return prev;
        return ensureDashboardIncluded([...prev, item]);
      });
    },
    [ensureDashboardIncluded]
  );

  const trimBreadcrumbs = useCallback(
    (currentPath: string) => {
      setBreadcrumbs((prev) => {
        const trimmed = prev.filter((b) => {
          const bPath = getPathWithoutQuery(b.path);
          const cPath = getPathWithoutQuery(currentPath);
          return cPath.startsWith(bPath);
        });
        return ensureDashboardIncluded(trimmed);
      });
    },
    [ensureDashboardIncluded]
  );

  const remUnusedBreadcrumbs = useCallback(
    (currentPath: string) => {
      setBreadcrumbs((prev) => {
        const currentPathNoQuery = getPathWithoutQuery(currentPath);
        const currentIndex = prev.findIndex(
          (b) => getPathWithoutQuery(b.path) === currentPathNoQuery
        );
        const sliced =
          currentIndex !== -1 ? prev.slice(0, currentIndex + 1) : prev;
        return ensureDashboardIncluded(sliced);
      });
    },
    [ensureDashboardIncluded]
  );

//   useEffect(() => {
//     const cleanSearch = stripQueryParams(location.search, ["tab"]);
//     const currentPath = location.pathname + location.search;
    

//     // Auto-generate breadcrumbs based on URL
//     const segments = location.pathname.split("/").filter(Boolean);
//     let pathAccumulator = "";
//     const generated: BreadcrumbItem[] = segments.map((segment) => {
//       pathAccumulator += `/${segment}`;
//       // Decode URI component to handle %20 and other encoded characters
//       const decodedSegment = decodeURIComponent(segment);
//       return {
//         path: pathAccumulator + location.search,
//         label: normalizeLabel(decodedSegment), // Capitalize
//       };
//     });
//     setBreadcrumbs(
//       ensureDashboardIncluded([DASHBOARD_BREADCRUMB, ...generated])
//     );

//     trimBreadcrumbs(currentPath);
//     remUnusedBreadcrumbs(currentPath);
//   }, [
//     location.pathname,
//     location.search,
//     trimBreadcrumbs,
//     remUnusedBreadcrumbs,
//     ensureDashboardIncluded,
//   ]);

useEffect(() => {
  // const cleanSearch = stripQueryParams(location.search, ["tab"]);
  const currentPath = location.pathname + location.search;

  setBreadcrumbs((prev:any) => {
    // 1. Find the longest matching existing breadcrumb
    const currentPathWithoutQuery = getPathWithoutQuery(location.pathname);
    const matchingIndex = prev?.findLastIndex((b:any) => 
      currentPathWithoutQuery.startsWith(getPathWithoutQuery(b.path))
    ); 

    // 2. Keep all breadcrumbs up to the matching one
    const preservedBreadcrumbs = prev.slice(0, matchingIndex + 1);
    
    // 3. Generate new segments for the remaining path
    const existingPath = matchingIndex >= 0 
      ? getPathWithoutQuery(prev[matchingIndex].path) 
      : '';
    const remainingPath = currentPathWithoutQuery.slice(existingPath.length);
    const segments = remainingPath.split('/').filter(Boolean);

    let pathAccumulator = existingPath;
    const newBreadcrumbs = segments.map((segment, index) => {
      pathAccumulator += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // First decode the segment, then normalize
      const decodedSegment = decodeURIComponent(segment);
      const label = normalizeLabel(decodedSegment);
      
      // Ensure we never return an empty label
      const finalLabel = label || decodedSegment;
      
      return {
        path: isLast 
          ? pathAccumulator + location.search
          : pathAccumulator,
        label: finalLabel
      };
    });

    // 4. Combine preserved and new breadcrumbs
    const combined = [...preservedBreadcrumbs, ...newBreadcrumbs];
    return ensureDashboardIncluded(combined);
  });

  trimBreadcrumbs(currentPath);
  remUnusedBreadcrumbs(currentPath);
}, [location.pathname, location.search, trimBreadcrumbs, remUnusedBreadcrumbs, ensureDashboardIncluded]);
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
