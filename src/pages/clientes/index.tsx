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
      <Header getHeaderY={(value) => setHeaderSizeY(value)}>seila</Header>
      <Box pt={headerSizeY} pb={`calc(${bottonNavigationY} + 4rem)`}>
        <Table colorScheme="blackAlpha">
          {/* <Thead>
            <Tr>
              <Th>Clientes </Th>
            </Tr>
          </Thead> */}
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Link href={`/clientes/${client.id}`} passHref>
                  <Td
                    bg="white"
                    _hover={{ filter: "brightness(0.95)", cursor: "pointer" }}
                  >
                    <ChakraLink>
                      <Tag size="md" variant="solid" color="white" bg="red.500">
                        {client.code}
                      </Tag>

                      <Box mt="1.5">
                        <Text>{client.brandName}</Text>
                        <Text>{client.address.street}</Text>
                        <Text>{client.address.city}</Text>
                      </Box>
                    </ChakraLink>
                  </Td>
                </Link>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
