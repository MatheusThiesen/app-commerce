import { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../service/apiClient";

type User = {
  codigo: number;
  nome: string;
  nomeGuerra: string;
  email: string;
  codGerente?: number;
  codSupervisor?: number;
  eAtivo: boolean;
  eGerente: boolean;
  eSupervisor: boolean;
};

type SignCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(creandentials: SignCredentials): Promise<ReponseSignIn | void>;
  signOut: () => void;
  sso: (token: string) => Promise<void>;
  reset(p: ResetProps): Promise<ReponseSignIn | void>;
  user?: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type ReponseSignIn = {
  title: string;
  status: "warning" | "success" | "error";
};

type ResetProps = {
  password: string;
  token: string;
};

export const AuthContext = createContext({} as AuthContextData);

const base_url =
  process.env.NODE_ENV !== "development"
    ? "https://app.alpardobrasil.com.br"
    : "http://localhost:3000";
const route_home = "/produtos";

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  window.location.reload();

  // authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "nextauth.token": token } = parseCookies();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user && !!token;

  // useEffect(() => {
  //   authChannel = new BroadcastChannel("auth");

  //   authChannel.onmessage = (message) => {
  //     switch (message.data) {
  //       case "signOut":
  //         signOut();
  //         // authChannel.close();
  //         break;
  //       case "signIn":
  //         window.location.replace(`${base_url}${route_home}`);
  //         break;

  //       default:
  //         break;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          const {
            codigo,
            nome,
            nomeGuerra,
            email,
            codGerente,
            codSupervisor,
            eAtivo,
            eGerente,
            eSupervisor,
          } = response.data;

          setUser({
            codigo,
            nome,
            nomeGuerra,
            email,
            codGerente,
            codSupervisor,
            eAtivo,
            eGerente,
            eSupervisor,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function authenticate(data: { token: string; refreshToken: string }) {
    setCookie(undefined, "nextauth.token", data.token, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
    setCookie(undefined, "nextauth.refreshToken", data.refreshToken, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });

    //@ts-ignore
    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    window.location.reload();

    const me = await api.get("/auth/me");
    setUser(me.data);

    // authChannel.postMessage("signIn");
    Router.push(route_home);
  }

  async function signIn({
    email,
    password,
  }: SignCredentials): Promise<ReponseSignIn | void> {
    try {
      const response = await api.post("/auth/signin", {
        email,
        senha: password,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (error) {
      const err = error as AxiosError;

      return {
        title: "Login ou senha incorretos",
        status: "warning",
      };
    }
  }

  async function reset({
    password,
    token: tokenReset,
  }: ResetProps): Promise<ReponseSignIn | void> {
    try {
      const response = await api.post("/auth/reset", {
        senha: password,
        token: tokenReset,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (err) {
      const error = err as AxiosError;

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
    const response = await api({
      method: "post",
      url: "/auth/sso",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { access_token: accessToken, refresh_token: refreshToken } =
      response.data;

    await authenticate({ token: accessToken, refreshToken });
  }

  return (
    <AuthContext.Provider
      value={{ signIn, isAuthenticated, user, signOut, reset, sso }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
