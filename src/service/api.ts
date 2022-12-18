import axios, { AxiosError } from "axios";
import * as https from "https";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false;
let failedRequestQueue: any[] = [];

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export function setupAPIClient(
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL:
      process.env.NODE_ENV !== "development"
        ? "https://api-app.alpardobrasil.com.br/"
        : "http://localhost:4444/",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    },
    httpsAgent: agent,
  });

  api.interceptors.response.use(
    (success) => success,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response.data?.message === "Unauthorized") {
          cookies = parseCookies(ctx);

          const { "nextauth.refreshToken": refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post(
                "/auth/refresh",
                {},
                {
                  headers: {
                    ["Authorization"]: `Bearer ${refreshToken}`,
                  },
                }
              )
              .then((response) => {
                const {
                  access_token: token,
                  refresh_token: refresh_token_new,
                } = response.data;

                setCookie(ctx, "nextauth.token", token, {
                  maxAge: 60 * 60 * 24 * 30, //30 Days
                  path: "/",
                });
                setCookie(ctx, "nextauth.refreshToken", refresh_token_new, {
                  maxAge: 60 * 60 * 24 * 30, //30 Days
                  path: "/",
                });

                //@ts-ignore
                api?.defaults?.headers["Authorization"] = `Bearer ${token}`;

                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) => request.onFailure(err));
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                //@ts-ignore
                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => reject(err),
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
