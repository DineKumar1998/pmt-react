import { useState, useEffect } from "react";
import { BellIcon, CalendarIcon } from "../icons";
import { useLocation } from "react-router-dom";
import AvatarDropdown from "./UserAvatar";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

const Header = () => {
  const { selectedLang, setSelectedLang } = useLang();
  const t = translations[selectedLang];
  const location = useLocation();

  // console.log(location.pathname.replace(/^\//, "").replace(/-/g, " "));

  // Handler to update selectedLang based on input value
  const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLang(e.target.value);
  };

  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
      <h2>{t.heading.myApplication}</h2>

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
