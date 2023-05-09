import {
  Avatar,
  Button,
  Link as CharkraLink,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { Me } from "../@types/me";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { setupAPIClient } from "../service/api";

import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext";
import { withSSRAuth } from "../utils/withSSRAuth";

interface HomeProps {
  me: Me;
}

export default function Home({ me }: HomeProps) {
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>Mais | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        user={{ name: me.email }}
        title="mais"
      />

      <Flex flexDir="column" w="full" align="center" mt="2rem">
        <Avatar size="xl" bg="gray.500" />
        <Flex mt="1rem">
          <Text fontSize={"lg"} fontWeight="light">
            Olá, {me.email}
          </Text>
        </Flex>

        <Stack
          mt="5rem"
          w="full"
          borderBottom={1}
          borderTop={1}
          borderColor={"gray.700"}
        >
          <Link href="/conta">
            <CharkraLink
              h="full"
              bg="white"
              color="gray.600"
              py="4"
              px="4"
              _hover={{
                textDecoration: "none",
                bg: "gray.200",
              }}
            >
              <Flex flexDir="row" justify="space-between" align="center">
                <Flex>
                  <Icon as={FaUserAlt} fontSize={"1.5rem"} color="gray.500" />
                  <Text ml="4">Minha conta</Text>
                </Flex>

                <Icon
                  as={IoIosArrowForward}
                  fontSize={"1.5rem"}
                  color="gray.500"
                />
              </Flex>
            </CharkraLink>
          </Link>
        </Stack>

        <Stack mt="1rem" w="full">
          <Button
            h="full"
            bg="white"
            color="gray.600"
            py="4"
            px="4"
            onClick={signOut}
          >
            <Text color="red"> Sair</Text>
          </Button>
        </Stack>
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
