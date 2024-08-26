import { ROUTE_HOME } from "@/middleware";
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Sso() {
  const router = useRouter();
  const { token } = router.query;
  const { sso } = useAuth();
  const toast = useToast();
  const history = useRouter();

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          await sso(String(token));
          history.push(ROUTE_HOME);
          window.location.reload();
        } catch (error) {
          toast({
            title: "Ocorreu erro com seu acesso direto, realize seu login!",
            status: "error",
            position: "top",
            isClosable: true,
          });
          history.push("/");
        }
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
