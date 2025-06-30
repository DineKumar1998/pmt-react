// components/layout/index.tsx
import React, { useState } from "react";
import LayoutSidebar from "./Sidebar";
import type { LayoutProps } from "@/types";

import "./layout.scss";
import Header from "./Header";
import { LangProvider } from "@/context/LangContext";

const Layout: React.FC<LayoutProps> = ({ children, route }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <LangProvider>
      <div className="main-layout">
        {/* Overlay for Mobile */}
        {isSidebarOpen && <div onClick={toggleSidebar} aria-hidden="true" />}

        {/* Main Layout */}
        {/* Sidebar */}
        <aside>
          <LayoutSidebar />
        </aside>

        {/* Main Content */}
        <main className="main-container">
          {/* Header */}
          <Header breakcrumbPath={route} />

          <div className="main-content">{children}</div>
        </main>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </LangProvider>
  );
};

export default Layout;
