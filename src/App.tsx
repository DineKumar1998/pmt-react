import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { memo } from "react";

import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

import "@styles/index.scss";

const App = memo(function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Router />
        <ToastContainer />
      </BrowserRouter>
    </HelmetProvider>
  );
});

export default App;
