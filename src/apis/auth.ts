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
export const validateUser = async (lang:string) => {
  const response = await api.get(`/auth/validate?language=${lang}`)
  return response.data
}
export const forgotPassword = async (email: string) => {
  const response = await api.get(`/auth/forgot-password?email=${email}`)
  return response.data
}
export const resetPassword = async (data: any) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
