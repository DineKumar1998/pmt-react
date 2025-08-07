import api from "./axios";

export const listMcis = async (projectId: number) => {
  const response = await api.get("/mci?projectId=" + projectId);
  return response.data;
};

export const updateMcis = async (projectId: number, data: any) => {
  const response = await api.patch("/mci/" + projectId, data);
  return response.data;
};