import { useState, useEffect } from "react";
import { CalendarIcon } from "../icons";
import { matchPath, Link, useSearchParams } from "react-router-dom";
import AvatarDropdown from "./UserAvatar";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { breadcrumbsData } from "@utils/breadcrumbs";

type HeaderProps = {
  breakcrumbPath?: string;
}

const Header = ({ breakcrumbPath }: HeaderProps) => {
  const { selectedLang, setSelectedLang } = useLang();
  const t = translations[selectedLang];
  const [searchParams] = useSearchParams();
  // const location = useLocation();

  // console.log(location.pathname.replace(/^\//, "").replace(/-/g, " "));

  // Handler to update selectedLang based on input value
  // const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedLang(e.target.value);
  // };

  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const breadcrumbs = getBreadcrumbs(breakcrumbPath);


  function getBreadcrumbs(pathname?: string) {
    //Set initial breadcrumb of dashboard
    const crumbs: { label?: string, path: string }[] = [
      { label: t.routes[breadcrumbsData[0].label], path: breadcrumbsData[0].path }
    ];

    let accumulatedPath = "";
    //Set breadcrumbs for paths other than dashboard
    if (pathname && pathname !== breadcrumbsData[0]?.path) {
      pathname.split("/").filter(Boolean).forEach((segment) => {
        accumulatedPath += `/${segment}`;
        const route = breadcrumbsData.find(r => matchPath({ path: r.path, end: true }, accumulatedPath));
        if (route) {
          if (accumulatedPath === "/manage-weightage/industry") {
            const industryName = searchParams.get("industryName");
            crumbs.push({ label: industryName ?? t.routes[route.label], path: accumulatedPath });
          }
          else if (accumulatedPath === "/client-list/parameters") {
            const clientName = searchParams.get("clientName");
            crumbs.push({ label: clientName ?? t.routes[route.label], path: accumulatedPath });
          }
          else {
            crumbs.push({ label: t.routes[route.label], path: accumulatedPath });
          }
        }
      });
    }

    return crumbs;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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


  return (
    <header className="header">
      <nav className="breadcrumbs">
        {breadcrumbs?.length
          ? breadcrumbs.length === 1
            ?
            <span className="heading">{breadcrumbs[0].label}</span>
            : breadcrumbs.map((crumb, idx) => (
              <span key={crumb.path}>
                {idx < breadcrumbs.length - 1 ? (
                  <>
                    {idx === 0 ? "" : " / "}
                    <Link className="breadcrumb-link" to={crumb.path}>{crumb.label}</Link>
                  </>
                ) : (
                  <span className="breadcrumb-current-tab"> / {crumb.label}</span>
                )}
              </span>
            )
            )
          : null
        }
      </nav>

      <section className="header-nav">
        <div className="language-toggle">
          <div className={`active-pill ${selectedLang}`} />

          <button
            className={selectedLang === "jp" ? "active" : ""}
            onClick={() => {
              console.log("japanese selected");
              setSelectedLang("jp")
            }}
          >
            日本語
          </button>
          <button
            className={selectedLang === "en" ? "active" : ""}
            onClick={() => {
              console.log("english selected");
              setSelectedLang("en")
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
    </header>
  );
};

export default Header;
