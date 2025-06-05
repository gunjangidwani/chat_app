import { apiClient } from ".";

export const getAllMessage = (chatId: string) => {
  return apiClient.get(`/message/${chatId}`);
};

export const sendMessage = (data: { content: string; chatId: string }) => {
  return apiClient.post("/message", data);
};
