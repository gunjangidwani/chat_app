import axios from "axios";
import { LocalStorage } from "../config/utils";

// create an Axios instance for api requests
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    //Set Auth token
    token ? (config.headers.Authorization = `Bearer ${token}`) : "";
    // it is required??
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = true;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
console.log(apiClient);

export const loginUser = (data: { email: string; password: string }) => {
  return apiClient.post("/user/login", data);
};

// export * from "./AuthApi";
// export * from "./ChatApi";
// export * from "./MessageApi";
