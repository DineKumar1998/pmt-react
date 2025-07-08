import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RouteComponent from "./RouteComponent";
import { useAppRoutes } from "@/hooks/useRoutes";
import AuthContext from "@/context/AuthContext";


const Router: React.FC = () => {
  const {isLoggedIn} = useContext(AuthContext)
  const {routes} = useAppRoutes()

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={`${route.path}-${index}`}
          path={route.path}
          element={<RouteComponent route={route} {...route} />}
        />
      ))}

      {/* Redirect to /404 for unknown routes */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to="/404" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default Router;
