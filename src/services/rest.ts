import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  forceLogout,
  getIsForceLoggingOut,
  setReduxToken,
} from "./authHelpers";
import { store } from "../store";

const isAuthRoute = (url?: string) => {
  if (!url) return false;

  return (
    url.includes("/login") ||
    url.includes("/logout")
  );
};

export default class RestService {
  client: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.client = axios.create(config);

    this.client.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (!isAuthRoute(config.url) && token && config.headers) {
          config.headers["Authorization"] = token;
          // if backend expects bearer:
          // config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      async (response) => {
        if (response?.data?.Token) {
          const newToken = response.data.Token;

          setReduxToken(newToken);
          localStorage.setItem("token", newToken);
          this.client.defaults.headers.common["Authorization"] = newToken;
        }

        return response;
      },
      async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;
        const requestUrl = originalRequest?.url;

        if (getIsForceLoggingOut()) {
          return Promise.reject(error);
        }

        if (isAuthRoute(requestUrl)) {
          return Promise.reject(error);
        }

        if (
          (status === 401 || status === 402 || status === 403) &&
          !originalRequest?._retry
        ) {
          originalRequest._retry = true;

          const newToken = error?.response?.data?.Token;

          if (newToken) {
            setReduxToken(newToken);
            localStorage.setItem("token", newToken);

            this.client.defaults.headers.common["Authorization"] = newToken;

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: newToken,
            };

            return this.client(originalRequest);
          }

          delete this.client.defaults.headers.common["Authorization"];
          forceLogout();
        }

        return Promise.reject(error);
      },
    );
  }

  get(endpoint: string) {
    return this.client.get<any>(endpoint);
  }

  post(endpoint: string, payload: any) {
    return this.client.post<any>(endpoint, payload);
  }

  put(endpoint: string, payload: any) {
    return this.client.put<any>(endpoint, payload);
  }

  postwithHeader(endpoint: string, payload: any, header: any) {
    return this.client.post<any>(endpoint, payload, header);
  }

  postWithConfig(
    endpoint: string,
    payload: any,
    config: AxiosRequestConfig<any> | undefined,
  ) {
    return this.client.post<any>(endpoint, payload, config);
  }

  delete(endpoint: string) {
    return this.client.delete<any>(endpoint);
  }
}

export const getToken = async (): Promise<string | null | undefined> => {
  return (store.getState() as any).user?.token || localStorage.getItem("token");
};
