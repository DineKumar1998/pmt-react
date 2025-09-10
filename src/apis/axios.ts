// import { AUTH } from "@/utils/constants";
import axios, { AxiosError } from "axios";
// const API_URL = import.meta.env.VITE_API_BASE_URL;
//
console.log("import.meta.env.VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL);

console.log("import.meta.env", import.meta.env);

const api = axios.create({
  baseURL: "https://pmt-api.whdev.in/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status === 403) {
        // localStorage.removeItem(AUTH.TOKEN_KEY);
        window.location.href = "/login";
      }

      const status = axiosError.response?.status;
      const data = axiosError.response?.data as { message: string; error: string };

      return Promise.reject({
        status,
        message: data.message ?? data.error ?? "Something went wrong!",
      });
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred");
    }
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

export default api;
