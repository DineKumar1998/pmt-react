import { TOKEN_KEY } from "@/utils";
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: "https://pmt-api.whdev.in/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
      }
      return {
        responseStatus: axiosError.response?.status,
        data: axiosError.response?.data,
      };
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred");
    }
  },
);

export default api;
