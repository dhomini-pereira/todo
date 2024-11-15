"use client";

import { API_URL } from "@/app/globals";
import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

let isRefreshing = false;
let refreshSubscribers: any[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: any) => {
  refreshSubscribers.push(callback);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("REFRESH_TOKEN"); //TODO: COLOCAR TAMBÉM UMA FORMA DE TRAZER O USER_ID
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("ACCESS_TOKEN", newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);
        } catch (refreshError) {
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("REFRESH_TOKEN");
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    if (error.response && error.response.status >= 500) {
      error.response.data.error = "Internal Server Error";
    }

    return Promise.reject(error);
  }
);

export default api;
