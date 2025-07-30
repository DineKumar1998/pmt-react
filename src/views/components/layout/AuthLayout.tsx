import React from "react";
import { useLocation } from "react-router-dom";
import type { LayoutProps } from "@/types/routes";

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const is404 = location.pathname === "/404" || location.pathname === "*";
  
  return (
    <>
      <div className="auth-layout">
        {is404 && (
          <header className="w-full text-center py-4 bg-gray-100">
            <h1 className="text-xl font-bold">Error</h1>
          </header>
        )}

        <main className="w-full h-screen flex items-center justify-center">
          {children}
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
