import { Flex, Spinner, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface SsoProps {
  token: string;
}

export default function Sso({ token }: SsoProps) {
  const { sso } = useAuth();
  const toast = useToast();
  const history = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await sso(token);
        history.push("/produtos");
      } catch (error) {
        toast({
          title: "Ocorreu erro com seu acesso direto, realize seu login!",
          status: "error",
          position: "top",
          isClosable: true,
        });
        history.push("/");
      }
    })();
  }, [token]);

  return (
    <>
      <Head>
        <title>SSO | App Alpar do Brasil</title>
      </Head>
      <Flex h="100vh" w="100%" justify="center" align="center">
        <Spinner ml="4" size="xl" />
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  if (!ctx.query?.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token: ctx.query?.token,
    },
  };
};
