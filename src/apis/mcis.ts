import api from "./axios";

export const listMcis = async (projectId: number) => {
  const response = await api.get("/mci?projectId=" + projectId);
  return response.data;
};