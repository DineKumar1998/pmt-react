import "@styles/index.scss";

import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { memo } from "react";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import { BreadcrumbProvider } from "./context/Breadcrumb";

// ** From Master
const App = memo(function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <BreadcrumbProvider>
            <Router />
            <ToastContainer hideProgressBar={true} />
          </BreadcrumbProvider>
        </BrowserRouter>
      </AuthProvider>
    </CookiesProvider>
  );
});

export default App;
