import {
  Box,
  Link as ChakraLink,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { bottonNavigationY } from "../../components/BottonNavigation";
import { Header } from "../../components/Header";
import { TitlesListing } from "../../components/TitlesListing ";

const clients = [
  {
    id: "1",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "3",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "4",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "5",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "6",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "7",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
  {
    id: "8",
    code: "35591",
    brandName: "A LEANDRO BAZAR E PAPELARIA",
    address: {
      street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
      city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
    },
  },
];

export default function Clientes() {
  const [headerSizeY, setHeaderSizeY] = useState("");

  return (
    <>
      <Header getHeaderY={(value) => setHeaderSizeY(value)} childrenSizeY={2.5}>
        <TitlesListing title="CLIENTES" />
      </Header>
      <Box pt={headerSizeY} pb={`calc(${bottonNavigationY} + 4rem)`}>
        <Table colorScheme="blackAlpha">
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td
                  bg="white"
                  _hover={{ filter: "brightness(0.95)", cursor: "pointer" }}
                >
                  <Link href={`/clientes/${client.id}`} passHref>
                    <ChakraLink w="full" display="contents">
                      <Tag size="md" variant="solid" color="white" bg="red.500">
                        {client.code}
                      </Tag>

                      <Box mt="1.5">
                        <Text>{client.brandName}</Text>
                        <Text>{client.address.street}</Text>
                        <Text>{client.address.city}</Text>
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
