import axios from "axios";
import { authStore } from "../store/authStore";

const baseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  "https://api.relty.example.com";

export const api = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
