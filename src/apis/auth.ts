import api from "./axios";

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const verifyOtp = async (data: any) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const logoutUser = async (_data: any) => {
  const response = await api.post("/auth/logout");
  return response.data;
};
