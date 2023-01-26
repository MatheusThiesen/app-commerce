import { Flex, Spinner } from "@chakra-ui/react";
import Head from "next/head";

export default function Sso() {
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

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
