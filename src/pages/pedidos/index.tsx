import {
  Box,
  Link as ChakraLink,
  Flex,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

const orders = [
  {
    id: "1",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
  {
    id: "2",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
  {
    id: "3",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
];

interface OrdersProps {
  me: Me;
}

export default function Orders({ me }: OrdersProps) {
  return (
    <>
      <Head>
        <title>Orçamentos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me?.email }}
        title="Orçamentos"
        Right={
          <Link href={`/pedidos/novo`} passHref>
            <ChakraLink mr="4">
              <IoMdAddCircle color="white" fontSize={"1.8rem"} />
            </ChakraLink>
          </Link>
        }
      />

      {false ? (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      ) : (
        <Flex
          pt={["6.5rem", "6.5rem", "6.5rem", "7rem"]}
          pb={["7rem"]}
          justify="center"
          w="full"
        >
          <Flex w="full" maxW="1200px">
            <Flex
              w="22rem"
              mr="3rem"
              display={["none", "none", "none", "flex"]}
              flexDirection="column"
            ></Flex>

            <Box w="full">
              <Table colorScheme="blackAlpha">
                <Tbody>
                  {orders.map((order) => (
                    <Tr key={order.id}>
                      <Td
                        bg="white"
                        _hover={{
                          filter: "brightness(0.95)",
                          cursor: "pointer",
                        }}
                      >
                        <Link href={`/clientes/${order.id}`} passHref>
                          <ChakraLink w="full">
                            <Flex justify={["space-between", "flex-start"]}>
                              <Tag
                                size="md"
                                variant="solid"
                                color="white"
                                bg="red.500"
                              >
                                #{order.code}
                              </Tag>

                              <Text
                                fontWeight="light"
                                ml={["0", "1rem"]}
                                fontSize="sm"
                              >
                                {order.createAt}
                              </Text>
                            </Flex>

                            <Box mt="1.5">
                              <Text
                                fontWeight="light"
                                fontSize="small"
                                color="gray.500"
                              >
                                CLIENTE
                              </Text>
                              <Text>{`${order.client.brandName} - ${order.client.cnpj}`}</Text>
                            </Box>
                            <Box mt="1.5">
                              <Text
                                fontWeight="light"
                                fontSize="small"
                                color="gray.500"
                              >
                                VALOR
                              </Text>
                              <Text fontWeight="bold" fontSize="lg">
                                {order.totalValue}
                              </Text>
                              <Text fontWeight="light" fontSize="small">
                                {order.paymentTerms}
                              </Text>
                            </Box>
                          </ChakraLink>
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Flex>
      )}
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
