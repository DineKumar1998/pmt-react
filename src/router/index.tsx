import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "@/utils";
import { routes } from "./routes";
import RouteComponent from "./RouteComponent";

const Router: React.FC = () => {
  const userIsLoggedIn = isLoggedIn();

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
          userIsLoggedIn ? (
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
