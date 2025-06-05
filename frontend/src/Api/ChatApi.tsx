import { apiClient } from ".";

export const fetchAllUserChats = () => {
  return apiClient.get("/chat");
};

export const createOrFetchChat = (userId: string) => {
  return apiClient.post("/chat", { userId });
};

export const createGroupChat = (data: { name: string; users: string }) => {
  return apiClient.post("/chat/group", data);
};

export const renameGroupChat = (data: { chatId: string; chatName: string }) => {
  return apiClient.put("/chat/rename", data);
};

export const addUserToGroupChat = (data: {
  userId: string;
  chatId: string;
}) => {
  return apiClient.put("/chat/groupadd", data);
};

export const removeUserFromGroupChat = (data: {
  userId: string;
  chatId: string;
}) => {
  return apiClient.put("/chat/groupremove", data);
};
