import "@styles/index.scss";

import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { memo } from "react";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import { BreadcrumbProvider } from "./context/Breadcrumb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LangProvider } from "./context/LangContext";
const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnWindowFocus: false,
  //     refetchOnReconnect: false,
  //     refetchOnMount: false,
  //     retry: 1,
  //     staleTime: 1000 * 60 * 5,
  //     gcTime: 1000 * 60 * 5,
  //   },
  // },
});
// ** From Master
const App = memo(function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <BreadcrumbProvider>
              <Router />
              <ToastContainer hideProgressBar={true} />
            </BreadcrumbProvider>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
});

export default App;
