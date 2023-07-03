import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useNumberInput,
} from "@chakra-ui/react";
import { defaultNoImage } from "../../global/parameters";
import { InputQuantity } from "../Form/InputQuantity";

export interface ProductProps {
  cod: number;
  name: string;
  reference: string;
  uri: string;
  packingQuantity: number;
  stockLocationsQtd: number;
}
interface ProductStoreComponentProps {
  product: ProductProps;
  amount: string;
  qtd: number;
}

export function ProductStoreComponent({
  product,
  amount,
  qtd,
}: ProductStoreComponentProps) {
  const { name, reference, uri, stockLocationsQtd } = product;

  const {
    getInputProps: inputQuantityInputProps,
    getIncrementButtonProps: inputQuantityIncrementButtonProps,
    getDecrementButtonProps: inputQuantityDecrementButtonProps,
    // valueAsNumber: quantity,
  } = useNumberInput({
    step: product.packingQuantity,
    defaultValue: qtd,
    min: 0,
    max: 0,
  });

  return (
    <Flex
      py="2"
      alignItems="start"
      h={["12rem", "12rem", "8rem", "8rem", "8rem"]}
      justify="space-between"
      align="center"
      flexDir={["column", "column", "row", "row", "row"]}
    >
      <Flex flex="1">
        <Image
          h={["6rem", "6rem", "7.5rem", "7.5rem", "7.5rem"]}
          maxW={["4rem", "4rem", "8rem", "8rem", "8rem"]}
          src={uri}
          objectFit="contain"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultNoImage;
          }}
        />

        <Box ml="4">
          <Text mt="4" fontSize="md" fontWeight="400">
            {name}
          </Text>

          <Flex flexDir="column" mb="1.5">
            <Text
              as="span"
              fontSize="smaller"
              color="gray.600"
              fontWeight="light"
            >
              Referência {reference}
            </Text>
            <Button
              colorScheme="red"
              size="xs"
              mt="2"
              variant="ghost"
              display="flex"
              justifyContent="start"
            >
              Remover item
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        flex="1"
        justify="space-between"
        w={["full", "full", "auto", "auto", "auto"]}
      >
        <Box mt={["2", "2", "4", "4", "4"]} w="8rem">
          <InputQuantity
            inputProps={inputQuantityInputProps}
            incrementButtonProps={inputQuantityIncrementButtonProps}
            decrementButtonProps={inputQuantityDecrementButtonProps}
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

        <Text mt="4" ml="4" fontWeight="normal" fontSize="lg">
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
}

export const ProductStore = ProductStoreComponent;
