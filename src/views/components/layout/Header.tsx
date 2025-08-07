import { CalendarIcon } from "../icons";
import { Link, useLocation } from "react-router-dom";
import AvatarDropdown from "./UserAvatar";
import { useLang } from "@/context/LangContext";
// import { translations } from "@/utils/translations";
import Wrapper from "../wrapper";
import { useBreadcrumbs } from "@/context/Breadcrumb";

type HeaderProps = {
  breakcrumbPath?: string;
};

const Header = ({  }: HeaderProps) => {
  const { breadcrumbs } = useBreadcrumbs();
  const locaiton = useLocation();
  const { selectedLang, setSelectedLang } = useLang();
  // const t = translations[selectedLang];

  console.log(locaiton.pathname, "locaiton");
  // State for current date and time
  const currentDateTime = new Date();

  // // Generate breadcrumb paths
  // const breadcrumbPaths = useMemo(() => {
  //   const pathSegments = path.split("/").filter(segment => segment.length > 0);
  //   const paths = [];

  //   // Always start with dashboard
  //   let accumulatedPath = "";

  //   // Build paths for each segment
  //   for (let i = 0; i < pathSegments.length; i++) {
  //     const segment = pathSegments[i];
  //     accumulatedPath += `/${segment}`;

  //     // Check if this is a dynamic segment (number or UUID)
  //     const isDynamicSegment = !isNaN(Number(segment)) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

  //     let displayLabel = breadcrumbMapping[segment as keyof typeof breadcrumbMapping];

  //     if (!displayLabel && isDynamicSegment && i > 0) {
  //       const previousSegment = pathSegments[i - 1];
  //       if (previousSegment.includes("edit") || previousSegment.includes("add")) {
  //         displayLabel = breadcrumbMapping[previousSegment as keyof typeof breadcrumbMapping];
  //       }
  //     }

  //     // If still no mapping, use the segment itself
  //     if (!displayLabel) {
  //       displayLabel = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  //     }

  //     const segmentParams = new URLSearchParams();

  //     for (let [key, value] of searchParams.entries()) {
  //       segmentParams.set(key, value);
  //     }

  //     console.log(segmentParams.toString())

  //     paths.push({
  //       path: accumulatedPath + (segmentParams.toString().length > 0 && i === pathSegments.length - 1 ? `?${segmentParams.toString()}` : ""),
  //       label: decodeURIComponent(displayLabel)
  //     });
  //   }

  //   return paths;
  // }, [path]);

  // console.log(breadcrumbPaths)

  // Format the date and time for IST (current date: May 24, 2025, 05:27 PM IST)
  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  console.log(breadcrumbs);

  return (
    <header className="header">
      <Wrapper>
        <nav className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => {
            const isHomeOrDashboard =
              breadcrumb.path === "/" || breadcrumb.path === "/dashboard";
            const isOnDashboard = location.pathname === "/dashboard";
            // Skip rendering if it's the home/dashboard breadcrumb and we're already on dashboard
            if (isHomeOrDashboard && isOnDashboard) {
              return (
                <span className="breadcrumb-current-tab">
                  {breadcrumb.label}
                </span>
              );
            }

            return (
              <span key={breadcrumb.path}>
                {index > 0 && <span> / </span>}
                {index < breadcrumbs.length - 1 ? (
                  <Link to={breadcrumb.path} className="breadcrumb-link">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current-tab">
                    {breadcrumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <section className="header-nav">
          <div className="language-toggle">
            <div className={`active-pill ${selectedLang}`} />

            <button
              className={selectedLang === "jp" ? "active" : ""}
              onClick={() => {
                setSelectedLang("jp");
              }}
            >
              日本語
            </button>
            <button
              className={selectedLang === "en" ? "active" : ""}
              onClick={() => {
                setSelectedLang("en");
              }}
            >
              English
            </button>
          </div>

          {/* Right side */}
          <div className="right-section">
            <CalendarIcon />
            <p className="datetime">
              <span>{formattedDate}</span>, <span>{formattedTime}</span>
            </p>

            {/* <BellIcon /> */}

            <AvatarDropdown />
          </div>
        </section>
      </Wrapper>
    </header>
  );
};

export default Header;
