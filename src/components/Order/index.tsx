import { Box, Link as ChakraLink, Flex, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";

export const Order = () => {
  return (
    <Link href={`/pedidos/detalhe/${"order.id"}`} passHref>
      <ChakraLink
        w="full"
        bg="white"
        display={"block"}
        p="4"
        borderRadius={"md"}
        _hover={{
          filter: "brightness(0.95)",
          cursor: "pointer",
        }}
      >
        <Flex justify={["space-between", "flex-start"]}>
          <Tag size="md" variant="solid" color="white" bg="red.500">
            #{"order.code"}
          </Tag>

          <Text fontWeight="light" ml={["0", "1rem"]} fontSize="sm">
            {"order.createAt"}
          </Text>
        </Flex>

        <Box mt="1.5">
          <Text fontWeight="light" fontSize="small" color="gray.500">
            CLIENTE
          </Text>
          <Text>{`${"order.client.brandName"} - ${"order.client.cnpj"}`}</Text>
        </Box>
        <Box mt="1.5">
          <Text fontWeight="light" fontSize="small" color="gray.500">
            VALOR
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            {"order.totalValue"}
          </Text>
          <Text fontWeight="light" fontSize="small">
            {"order.paymentTerms"}
          </Text>
        </Box>
      </ChakraLink>
    </Link>
  );
};
