import { AUTH } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";
// const API_URL = import.meta.env.VITE_API_BASE_URL;

const cookies = new Cookies()

const api = axios.create({
  baseURL: "https://pmt-api.whdev.in/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = cookies.get(AUTH.TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {

    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status === 403) {
        localStorage.removeItem(AUTH.TOKEN_KEY);
        window.location.href = "/login";
      }

      const status = axiosError.response?.status;
      const data = axiosError.response?.data as { message: string };

      return Promise.reject({
        status, message: data.message ?? "Something went wrong!"
      })
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
