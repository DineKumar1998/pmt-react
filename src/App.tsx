import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { memo } from "react";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import "@styles/index.scss";

// ** From Master

const App = memo(function App() {
  return (
      <CookiesProvider>
        <AuthProvider>
          <BrowserRouter>
            <Router />
            <ToastContainer hideProgressBar={true} />
          </BrowserRouter>
        </AuthProvider>
      </CookiesProvider>
  );
});

export default App;
