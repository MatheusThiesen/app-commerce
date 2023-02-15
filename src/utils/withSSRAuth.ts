import decode from "jwt-decode";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "./../service/errors/AuthTokenError";
import { validateUserPermission } from "./validateUserPermission";

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<any>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["nextauth.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (!!options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;
      const userHasValidPermissions = validateUserPermission({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          // notFound: true,
          redirect: {
            destination: "/produtos",
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      const error = err as any;

      console.log(err instanceof AuthTokenError);

      if (err instanceof AuthTokenError || error?.response === undefined) {
        destroyCookie(ctx, "nextauth.token");
        destroyCookie(ctx, "nextauth.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    return Promise.reject();
  };
}
