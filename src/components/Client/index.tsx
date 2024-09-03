import { Box, Flex, Icon, Tag, Text } from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";
import { Client as ClientProps } from "../../hooks/queries/useClients";

interface ClientComponentProps {
  client: ClientProps;
  colorTag?: string;
}

export const Client = ({ client }: ClientComponentProps) => {
  const colorTag =
    !!client?.titulo?.length && client?.titulo?.length >= 1
      ? "red.500"
      : "green.500";

  return (
    <Box w="full" bg="white" p="3" borderRadius="lg" display="block">
      <Flex align="center" justify="space-between">
        <div className="flex justify-center items-center gap-x-1">
          {colorTag === "red.500" ? (
            <Icon as={RiCloseCircleFill} color={colorTag} fontSize="1.5rem" />
          ) : (
            <Icon as={HiBadgeCheck} color={colorTag} fontSize="1.5rem" />
          )}

          <Tag
            size="md"
            variant="solid"
            color="white"
            bg={colorTag}
            borderRadius="lg"
          >
            {client.codigo}
          </Tag>
        </div>

        <div className="flex flex-col items-end">
          <Text fontSize="sm" fontWeight="medium" color="gray.800">
            CNPJ: {client.cnpjFormat}
          </Text>
          <span className="font-light ml-1 text-sm">
            {client.conceito?.descricao}
          </span>
        </div>
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
