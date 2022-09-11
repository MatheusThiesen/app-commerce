import {
  Box,
  Flex,
  Link as ChakraLink,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { HeaderNavigation as Header } from "../../components/HeaderNavigation";
import { TitlesListing } from "../../components/TitlesListing ";

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

export default function Pedidos() {
  const [headerSizeY, setHeaderSizeY] = useState("");

  return (
    <>
      <Header
        Right={
          <Tooltip label="Novo Pedido">
            <Flex mr="4" align="center">
              <Link href={`/pedidos/novo/seila`} passHref>
                <ChakraLink>
                  <IoMdAddCircle color="white" fontSize={"1.8rem"} />
                </ChakraLink>
              </Link>
            </Flex>
          </Tooltip>
        }
        getHeaderY={(value) => setHeaderSizeY(value)}
        childrenSizeY={2.5}
      >
        <TitlesListing title="PEDIDOS" />
      </Header>

      <Box>
        <Table colorScheme="blackAlpha">
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td
                  bg="white"
                  _hover={{ filter: "brightness(0.95)", cursor: "pointer" }}
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
    </>
  );
}
