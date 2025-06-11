import { store } from "@/redux/store";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = store.getState().user.account.access_token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Handle 401 errors (e.g., token expired)
    if (error.response?.status === 401) {
      // Optional: Dispatch logout action or refresh token
      console.error("Unauthorized, token may be invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default instance;
