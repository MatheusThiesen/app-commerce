import {
  Box,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

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
    id: "4",
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
    id: "4",
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
];

export default function Clientes() {
  return (
    <Box pb="4rem" overflow="scroll" maxH="100vh">
      <Table colorScheme="blackAlpha">
        <Thead>
          <Tr>
            <Th>Clientes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clients.map((client) => (
            <Tr key={client.id}>
              <Td bg="white">
                <Tag size="md" variant="solid" color="white" bg="red.500">
                  {client.code}
                </Tag>

                <Box mt="1.5">
                  <Text>{client.brandName}</Text>
                  <Text>{client.address.street}</Text>
                  <Text>{client.address.city}</Text>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
