import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "../../contexts/StoreContext";
import { defaultNoImage, spaceImages } from "../../global/parameters";
import { Product, StockLocation } from "../../hooks/queries/useProducts";
import { InputQuantity } from "../Form/InputQuantity";

interface ProductStoreComponentProps {
  amount: string;
  qtd: number;
  product: Product;
  stockLocation: StockLocation;
  isOnlyInfo?: boolean;
}

export function ProductStoreComponent({
  product,
  amount,
  qtd,
  stockLocation,
  isOnlyInfo,
}: ProductStoreComponentProps) {
  const { removeItem, addItem } = useStore();

  const stockLocationsQtd =
    product?.locaisEstoque?.find(
      (f) => String(f.periodo) === String(stockLocation.periodo)
    )?.quantidade ?? 0;

  const [quantity, setQuantity] = useState(qtd);

  useEffect(() => {
    addItem({
      product: product,
      qtd: quantity,
      stockLocation: stockLocation,
      brand: product.marca,
    });
  }, [quantity]);

  return (
    <Flex
      py="2"
      alignItems="start"
      h={
        isOnlyInfo
          ? ["10rem", "9rem", "6rem", "6rem", "6rem"]
          : ["14rem", "14rem", "10rem", "10rem", "10rem"]
      }
      justify="space-between"
      align="center"
      flexDir={["column", "column", "row", "row", "row"]}
    >
      <Flex flex="1" align="center">
        <Link href={`/pedidos/novo/produtos/${product.codigo}`} passHref>
          <Box as="a" h="full">
            <Image
              h={
                isOnlyInfo
                  ? ["4rem", "4rem", "3rem", "3rem"]
                  : ["6rem", "6rem", "7.5rem", "7.5rem", "7.5rem"]
              }
              maxW={
                isOnlyInfo
                  ? ["6rem", "6rem", "6rem", "6rem"]
                  : ["4rem", "4rem", "8rem", "8rem", "8rem"]
              }
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
          </Box>
        </Link>

        <Flex ml="4" flexDir="column">
          <Link href={`/pedidos/novo/produtos/${product.codigo}`} passHref>
            <Flex flexDir="column" mb="1.5" as="a">
              <Text mt={isOnlyInfo ? 0 : "4"} fontSize="md" fontWeight="400">
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
            </Flex>
          </Link>

          {!isOnlyInfo && (
            <Button
              colorScheme="red"
              size="xs"
              variant="ghost"
              display="flex"
              justifyContent="start"
              onClick={() =>
                removeItem({
                  productCod: product.codigo,
                  stockLocationPeriod: stockLocation.periodo,
                  brandCod: product.marca.codigo,
                })
              }
            >
              Remover item
            </Button>
          )}
        </Flex>
      </Flex>

      <Flex
        flex="1"
        justify="space-between"
        w={["full", "full", "auto", "auto", "auto"]}
      >
        {isOnlyInfo ? (
          <Text
            mt="2"
            as={"span"}
            fontSize="sm"
            fontWeight="light"
            color="gray.600"
            display="block"
            textAlign="center"
          >
            {`${quantity} und`}
          </Text>
        ) : (
          <Box mt={["2", "2", "4", "4", "4"]} w="8rem">
            <InputQuantity
              value={quantity}
              step={product?.qtdEmbalagem}
              max={stockLocationsQtd}
              min={product?.qtdEmbalagem}
              onDecremental={(qtd) => setQuantity(qtd)}
              onIncremental={(qtd) => setQuantity(qtd)}
            />
            <Text
              mt="2"
              as={"span"}
              fontSize="sm"
              fontWeight="light"
              color="gray.500"
              display="block"
              textAlign="center"
            >
              {`${stockLocationsQtd} disponível`}
            </Text>
          </Box>
        )}

        <Text mt="4" ml="4" fontWeight="normal" fontSize="lg">
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
}

export const ProductStore = ProductStoreComponent;
