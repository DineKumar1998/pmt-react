import React, { Suspense, useContext } from "react";
import { Navigate } from "react-router-dom";
import Loader from "@/views/components/Loader";
import Layout from "@/views/components/layout";
import AuthLayout from "@/views/components/layout/AuthLayout";
import ErrorBoundary from "@/views/components/ErrorBoundary";
// import usePermissions from "@/hooks/usePermissions";
import AuthContext from "@/context/AuthContext";
import type { RouteType } from "@/types/routes";

interface RouteComponentProps {
  route: RouteType;
}

const RouteComponent: React.FC<RouteComponentProps> = ({
  route,
  ...restProps
}) => {
  const LayoutComponent = route.layout === "auth" ? AuthLayout : Layout;
  const Component = route.component;
  const {isLoggedIn} = useContext(AuthContext)

  // const { hasPermission } = usePermissions();

  if (route.layout !== "auth" && !isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // if (route.permission && !hasPermission(route.permission)) {
  //   return <Navigate to="/404" replace />;
  // }

  if (route.layout === "auth" && isLoggedIn()) {
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
