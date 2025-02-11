"use client";

import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import Router from "next/router";
import nookies, { parseCookies, setCookie } from "nookies";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Me } from "../@types/me";
import { ROUTE_HOME } from "../middleware";
import { BASE_URL } from "../service/api";
import { api } from "../service/apiClient";

type SignCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(creandentials: SignCredentials): Promise<ResponseSignIn | void>;
  refreshToken(
    ctx?: GetServerSidePropsContext | undefined
  ): Promise<string | undefined>;
  signOut: () => void;
  sso: (token: string) => Promise<void>;
  reset(p: ResetProps): Promise<ResponseSignIn | void>;
  user: Me;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type ResponseSignIn = {
  title: string;
  status: "warning" | "success" | "error";
};

type ResetProps = {
  password: string;
  token: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  nookies.set({}, "nextauth.token", "", {
    maxAge: -1,
    path: "/",
  });
  nookies.set({}, "nextauth.refreshToken", "", {
    maxAge: -1,
    path: "/",
  });

  Router.push("/");
  // window.location.reload();
}
export async function refreshToken(
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<string | undefined> {
  const { "nextauth.refreshToken": tokenRefresh } = parseCookies(ctx);

  try {
    const refreshTokenResponse = await axios.post<{
      refresh_token: string;
      access_token: string;
    }>(`${BASE_URL}auth/refresh`, {
      token: tokenRefresh,
    });

    setCookie(ctx, "nextauth.token", refreshTokenResponse.data.access_token, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
    setCookie(
      ctx,
      "nextauth.refreshToken",
      refreshTokenResponse.data.refresh_token,
      {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      }
    );

    return refreshTokenResponse.data.access_token;
  } catch (error) {
    console.log(error);
    signOut();
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "nextauth.token": token } = parseCookies();

  const [user, setUser] = useState<Me>({} as Me);
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (token) {
      api
        .get<Me>("/auth/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, [token]);

  async function authenticate(data: { token: string; refreshToken: string }) {
    setCookie(undefined, "nextauth.token", data.token, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
    setCookie(undefined, "nextauth.refreshToken", data.refreshToken, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });

    Router.push(ROUTE_HOME);
  }

  async function signIn({
    email,
    password,
  }: SignCredentials): Promise<ResponseSignIn | void> {
    try {
      const response = await api.post("/auth/signin", {
        email,
        senha: password,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (error) {
      return {
        title: "Login ou senha incorretos",
        status: "warning",
      };
    }
  }

  async function reset({
    password,
    token: tokenReset,
  }: ResetProps): Promise<ResponseSignIn | void> {
    try {
      const response = await api.post("/auth/reset", {
        senha: password,
        token: tokenReset,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (err) {
      const error = err as AxiosError<any>;

      if (error.response?.status === 400) {
        return {
          title: error.response?.data?.message,
          status: "warning",
        };
      }

      return {
        title: "Desculpe, ocorreu um erro interno, Tente novamente mais tarde",
        status: "error",
      };
    }
  }

  async function sso(token: string) {
    const response = await axios({
      baseURL:
        process.env.NODE_ENV !== "development"
          ? "https://api-app.alpardobrasil.com.br/"
          : "http://localhost:4444/",
      method: "post",
      url: "/auth/sso",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    const { access_token: accessToken, refresh_token: refreshToken } =
      response.data;

    setCookie(undefined, "nextauth.token", accessToken, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
    setCookie(undefined, "nextauth.refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isAuthenticated,
        user,
        signOut,
        reset,
        sso,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
