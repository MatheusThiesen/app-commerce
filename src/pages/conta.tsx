import { Box, Flex, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { InputFake } from "../components/Form/InputFake";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

interface ContaProps {
  me: {
    id: string;
    email: string;
  };
}

export default function Conta(props: ContaProps) {
  const {
    isOpen: isOpenModalUpdatePassword,
    onOpen: onOpenModalUpdatePassword,
    onClose: onCloseModalUpdatePassword,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>Inicio - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll user={{ name: props.me.email }} />

      <Flex justify="center" pt="3rem" px="1.25rem">
        <Box bg="white" borderRadius="md" p="6" maxW="47.75rem" w="full">
          <Box>
            <Text as="h2" fontWeight="bold" fontSize="2xl">
              Minha conta
            </Text>
          </Box>

          <Stack spacing="4" mt="6">
            <InputFake label="E-mail" value={props.me?.email} />
            <InputFake
              label="Password"
              value="************"
              onUpdate={onOpenModalUpdatePassword}
            />
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/auth/me");

  return {
    props: {
      me: response.data,
    },
  };
});
