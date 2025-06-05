import { apiClient } from ".";

export const loginUser = (data: { email: string; password: string }) => {
  return apiClient.post("/user/login", data);
};

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  pic: string;
}) => {
  return apiClient.post("/user", data);
};

export const searchUser = (search: string) => {
  return apiClient.get(`/user?search=${search}`);
};
