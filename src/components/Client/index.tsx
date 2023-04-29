import { Box, Link as ChakraLink, Flex, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Client as ClientProps } from "../../hooks/queries/useClients";

interface ClientComponentProps {
  client: ClientProps;
}

export const Client = ({ client }: ClientComponentProps) => {
  return (
    <Link key={client.codigo} href={`/clientes/${client.codigo}`} passHref>
      <ChakraLink
        w="full"
        display="block"
        bg="white"
        p="3"
        borderRadius="lg"
        _hover={{
          filter: "brightness(0.95)",
          cursor: "pointer",
        }}
      >
        <Flex columnGap="1" align="center" justify="space-between">
          <Tag
            size="md"
            variant="solid"
            color="white"
            bg="red.500"
            borderRadius="lg"
          >
            {client.codigo}
          </Tag>

          <Text fontSize="sm" fontWeight="medium" color="gray.800">
            CNPJ: {client.cnpjFormat}
          </Text>
        </Flex>

        <Box mt="1.5">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {client.razaoSocial}
          </Text>
          <Text fontSize="sm" fontWeight="light" color="gray.600">
            {`${client.logradouro}, ${client.numero} - ${client.bairro}, ${client.cidade} - ${client.uf}, ${client.cepFormat}`}
          </Text>
        </Box>
      </ChakraLink>
    </Link>
  );
};
