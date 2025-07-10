import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { memo } from "react";

import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import "@styles/index.scss";

// ** From Master

const App = memo(function App() {
  return (
    <HelmetProvider>
      <CookiesProvider>
        <AuthProvider>
          <BrowserRouter>
            <Router />
            <ToastContainer hideProgressBar={true} />
          </BrowserRouter>
        </AuthProvider>
      </CookiesProvider>
    </HelmetProvider>
  );
});

export default App;
