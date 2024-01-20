import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { IoIosCloseCircle } from "react-icons/io";
import { RiEditCircleFill } from "react-icons/ri";
import { defaultNoImage, spaceImages } from "../../global/parameters";
import { Product } from "../../hooks/queries/useProducts";

interface ProductOrderComponentProps {
  amount: string;
  unitAmount: string;
  qtd: number;
  product: Product;

  isTrash?: boolean;
  isChange?: boolean;
}

export function ProductOrderComponent({
  product,
  amount,
  unitAmount,
  qtd,
  isTrash = false,
  isChange = false,
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
      borderWidth={isTrash || isChange ? "2px" : 0}
      borderColor={isTrash ? "red.500" : "yellow.500"}
      position="relative"
    >
      {isTrash && (
        <Box position="absolute" top={"-13px"} left={"-16px"}>
          <Icon as={IoIosCloseCircle} color="red.500" fontSize={"1.5rem"} />
        </Box>
      )}

      {isChange && (
        <Box position="absolute" top={"-12px"} left={"-16px"}>
          <Icon as={RiEditCircleFill} color="yellow.500" fontSize={"1.5rem"} />
        </Box>
      )}

      <Flex flex="1" h={"full"} align="flex-start">
        <Image
          maxW={["8rem", "8rem", "8rem", "8rem", "8rem"]}
          height="full"
          maxHeight="8rem"
          src={`${spaceImages}/Produtos/${
            product?.imagemPreview
              ? product.imagemPreview
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
            <Text
              mt={"4"}
              fontSize="md"
              fontWeight="400"
              textDecor={isTrash ? "line-through" : undefined}
            >
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
          fontSize={isTrash || isChange ? "lg" : "md"}
          fontWeight="bold"
          color={isTrash ? "red.500" : isChange ? "yellow.500" : "gray.600"}
          display="block"
          textAlign="center"
          textDecor={isTrash ? "line-through" : undefined}
        >
          {`${qtd} und`}
        </Text>

        <Text
          fontWeight="normal"
          fontSize="lg"
          textDecor={isTrash ? "line-through" : undefined}
        >
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
}

export const ProductOrder = ProductOrderComponent;
