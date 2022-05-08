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
import { BottonNavigation } from "../components/BottonNavigation";
import { api } from "../service/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
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
          window.location.replace("http://localhost:3000/inicio");
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
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
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
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers["Authorization"] = `Barer ${token}`;

      Router.push("/inicio");
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
      {isAuthenticated && <BottonNavigation />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
