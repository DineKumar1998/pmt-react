// components/layout/index.tsx
import React, { useCallback, useState } from "react";

import Header from "./Header";
import type { LayoutProps } from "@/types/routes";
import LayoutSidebar from "./SideBarComponent";
import Wrapper from "../wrapper";
import Footer from "./Footer";

import "./layout.scss";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="main-container">
      <Header />
      <Wrapper>
        <div className="main-content">{children}</div>
      </Wrapper>
      <Footer />
    </main>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
      <div className={`main-layout ${isSidebarOpen ? "" : "sb-expand"}`}>
        {/* This component will re-render because its props change */}
        <LayoutSidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* 2. Use the memoized component here. It will not re-render on toggle. */}
        <MainContent>{children}</MainContent>
      </div>
  );
};

export default Layout;