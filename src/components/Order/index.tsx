import { Box, Flex, Icon, Tag, Text } from "@chakra-ui/react";
import {
  selectStatusColor,
  selectStatusIcon,
} from "../../hooks/queries/useOrder";

interface Props {
  code?: number;
  paymentCondition: string;
  client: string;
  totalValue: string;
  date: string;
  eRascunho: boolean;
  status?: {
    code: number;
    description: string;
  };
  seller?: {
    codigo: number;
    nome: string;
  };
}

export const Order = ({
  code,
  paymentCondition,
  client,
  totalValue,
  date,
  eRascunho,
  status,
  seller,
}: Props) => {
  return (
    <Box w="full" bg="white" display={"block"} p="4" borderRadius={"md"}>
      <Flex justify={["space-between"]}>
        <Flex align="center" flexDir="row" columnGap={"2"}>
          <Icon
            as={selectStatusIcon(eRascunho ? 99 : status?.code)}
            color={selectStatusColor(eRascunho ? 99 : status?.code)}
            fontSize="4xl"
          />

          <Tag
            size="sm"
            variant="solid"
            color="white"
            bg={selectStatusColor(eRascunho ? 99 : status?.code)}
            // opacity={0.8}
            textTransform="uppercase"
          >
            {eRascunho
              ? "RASCUNHO"
              : status?.description
              ? status?.description
              : "-"}
          </Tag>
        </Flex>

        <Text fontWeight="light" ml={["0", "1rem"]} fontSize="sm">
          {date}
        </Text>
      </Flex>
      {code && (
        <Box mt="1.5">
          <Text fontWeight="light" fontSize="small" color="gray.500">
            PEDIDO
          </Text>
          <Text fontWeight="bold" fontSize="md">
            {code}
          </Text>
        </Box>
      )}
      <Box mt="1.5">
        <Text fontWeight="light" fontSize="small" color="gray.500">
          CLIENTE
        </Text>
        <Text fontWeight="bold">{client}</Text>
      </Box>
      <Box mt="1.5">
        <Text fontWeight="light" fontSize="small" color="gray.500">
          VENDEDOR
        </Text>
        <Text fontWeight="bold">
          {seller ? `${seller.codigo} - ${seller.nome}` : "-"}
        </Text>
      </Box>
      <Box mt="1.5">
        <Text fontWeight="light" fontSize="small" color="gray.500">
          CONDIÇÃO PAGAMENTO
        </Text>
        <Text fontWeight="bold" fontSize="md">
          {paymentCondition}
        </Text>
      </Box>
      <Box mt="1.5">
        <Text fontWeight="light" fontSize="small" color="gray.500">
          VALOR
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {totalValue}
        </Text>
      </Box>
    </Box>
  );
};
