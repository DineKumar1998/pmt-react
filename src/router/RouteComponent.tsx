import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import Loader from "@/views/components/Loader";
import { isLoggedIn } from "@/utils/auth";
import type { RouteType } from "@/types";
import Layout from "@/views/components/layout";
import AuthLayout from "@/views/components/layout/AuthLayout";
import ErrorBoundary from "@/views/components/ErrorBoundary";

interface RouteComponentProps {
  route: RouteType;
}

const RouteComponent: React.FC<RouteComponentProps> = ({
  route,
  ...restProps
}) => {
  const LayoutComponent = route.layout === "auth" ? AuthLayout : Layout;
  const Component = route.component;

  const userIsLoggedIn = isLoggedIn();

  if (route.layout !== "auth" && !userIsLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (route.layout === "auth" && userIsLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutComponent route={route.path}>
      <ErrorBoundary
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <p>Error loading component. Please refresh the page.</p>
          </div>
        }
      >
        <Suspense fallback={<Loader size={100} />}>
          <Component {...restProps} />
        </Suspense>
      </ErrorBoundary>
    </LayoutComponent>
  );
};

export default RouteComponent;
