import axios, { AxiosRequestConfig } from "axios";
import * as https from "https";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { refreshToken } from "../contexts/AuthContext";

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? "https://api-app.alpardobrasil.com.br/"
    : "http://localhost:4444/";

export function setupAPIClient(
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  const refreshAndRetryQueue: RetryQueueItem[] = [];
  let isRefreshing = false;

  const api = axios.create({
    httpsAgent: agent,
    baseURL: BASE_URL,
  });

  api.interceptors.request.use(
    (config) => {
      let cookies = parseCookies(ctx);
      const { "nextauth.token": token } = cookies;

      if (token) {
        config.headers!["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      let cookies = parseCookies(ctx);
      const { "nextauth.refreshToken": tokenRefresh } = cookies;

      const originalRequest: AxiosRequestConfig = error.config;

      if (error.response && error.response.status === 401 && !!tokenRefresh) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newAccessToken = await refreshToken(ctx);

            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

            refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
              api
                .request(config)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
            });

            refreshAndRetryQueue.length = 0;

            return api(originalRequest);
          } catch (refreshError) {
            throw refreshError;
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise<void>((resolve, reject) => {
          refreshAndRetryQueue.push({
            config: originalRequest,
            resolve,
            reject,
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
}
