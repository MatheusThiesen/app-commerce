import { Box, Flex, Tag, Text } from "@chakra-ui/react";
import { Client as ClientProps } from "../../hooks/queries/useClients";

interface ClientComponentProps {
  client: ClientProps;
  colorTag?: string;
}

export const Client = ({
  client,
  colorTag = "red.500",
}: ClientComponentProps) => {
  return (
    <Box w="full" display="block" bg="white" p="3" borderRadius="lg">
      <Flex columnGap="1" align="center" justify="space-between">
        <Tag
          size="md"
          variant="solid"
          color="white"
          bg={colorTag}
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
        <Text
          fontSize="sm"
          fontWeight="light"
          color="gray.600"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {`${client.logradouro}, ${client.numero} - ${client.bairro}, ${client.cidade} - ${client.uf}, ${client.cepFormat}`}
        </Text>
      </Box>
    </Box>
  );
};
