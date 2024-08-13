import { Link } from "@chakra-ui/next-js";
import { Avatar, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { HeaderNavigation } from "../components/HeaderNavigation";

import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { signOut, user } = useAuth();

  return (
    <>
      <Head>
        <title>Mais | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll title="mais" />

      <Flex flexDir="column" w="full" align="center" mt="2rem">
        <Avatar size="xl" bg="gray.500" />
        <Flex mt="1rem">
          <Text fontSize={"lg"} fontWeight="light">
            Olá, {user?.nome}
          </Text>
        </Flex>

        <Stack
          mt="5rem"
          w="full"
          borderBottom={1}
          borderTop={1}
          borderColor={"gray.700"}
        >
          <Link
            href="/conta"
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
