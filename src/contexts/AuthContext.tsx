import { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  createContext,
  ReactNode,
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
  user?: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type ReponseSignIn = {
  title: string;
  status: "warning" | "success";
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  // authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "nextauth.token": token } = parseCookies();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;
        case "signIn":
          window.location.replace("https://app.alpardobrasil.com.br/produtos");
          break;

        default:
          break;
      }
    };
  }, []);

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

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      });

      //@ts-ignore
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      const me = await api.get("/auth/me");

      setUser(me.data);

      Router.push("/produtos");
      authChannel.postMessage("signIn");
    } catch (error) {
      const err = error as AxiosError;

      return {
        title: "Login ou senha incorretos",
        status: "warning",
      };
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
