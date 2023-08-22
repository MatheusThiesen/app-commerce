import { Flex, Image, Text } from "@chakra-ui/react";
import { defaultNoImage, spaceImages } from "../../global/parameters";
import { Product } from "../../hooks/queries/useProducts";

interface ProductOrderComponentProps {
  amount: string;
  unitAmount: string;
  qtd: number;
  product: Product;
}

export function ProductOrderComponent({
  product,
  amount,
  unitAmount,
  qtd,
}: ProductOrderComponentProps) {
  return (
    <Flex
      py="2"
      alignItems="start"
      h={["14rem", "12rem", "10rem", "8rem", "8rem"]}
      flexDir={["column", "column", "row", "row", "row"]}
      align="center"
      bg="white"
      borderRadius="md"
      px="4"
    >
      <Flex flex="1" h={"full"} align="flex-start">
        <Image
          maxW={["8rem", "8rem", "8rem", "8rem", "8rem"]}
          height="full"
          maxHeight="8rem"
          src={`${spaceImages}/Produtos/${
            product.imagens && product.imagens[0]
              ? product.imagens[0].nome
              : product.referencia + "_01"
          }_smaller`}
          objectFit="contain"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultNoImage;
          }}
        />

        <Flex ml="4" flexDir="column" align="center">
          <Flex flexDir="column" mb="1.5" as="a">
            <Text mt={"4"} fontSize="md" fontWeight="400">
              {product.descricao}
            </Text>

            <Text
              as="span"
              fontSize="smaller"
              color="gray.600"
              fontWeight="light"
              lineHeight="4"
            >
              Cód. {product.codigo}
            </Text>
            <Text
              as="span"
              fontSize="smaller"
              color="gray.600"
              fontWeight="light"
              lineHeight="4"
            >
              Referência {product.referencia}
            </Text>
            <Text
              as="span"
              fontSize="smaller"
              color="gray.600"
              fontWeight="light"
              lineHeight="4"
            >
              Grade {product.descricaoAdicional}
            </Text>
            <Text
              as="span"
              fontSize="smaller"
              color="gray.600"
              fontWeight="light"
              lineHeight="4"
            >
              Valor unitário
              <Text as={"b"} ml="1">
                {unitAmount}
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        flex="1"
        justify="space-between"
        align="center"
        w={["full", "full", "auto", "auto", "auto"]}
        h={["auto", "auto", "full", "full", "full"]}
      >
        <Text
          as={"span"}
          fontSize="sm"
          fontWeight="light"
          color="gray.600"
          display="block"
          textAlign="center"
        >
          {`${qtd} und`}
        </Text>

        <Text fontWeight="normal" fontSize="lg">
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
}

export const ProductOrder = ProductOrderComponent;
