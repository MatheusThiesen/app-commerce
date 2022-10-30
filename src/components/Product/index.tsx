import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { memo } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useProductCatalog } from "../../hooks/useProductCatalog";

export interface ProductProps {
  cod: number;
  name: string;
  descriptionAdditional: string;
  priceSale: string;
  reference: string;
  uri: string;
}
interface ProductComponentProps {
  product: ProductProps;
}

export function ProductComponent({ product }: ProductComponentProps) {
  const {
    isActivated: isActivatedProductCatalog,
    productsSelected,
    onRemoveProduct,
    onSelectedProduct,
  } = useProductCatalog();
  const { cod, name, descriptionAdditional, reference, priceSale, uri } =
    product;

  const isProductSelectedCatalog = productsSelected.some(
    (produto) => cod === produto.cod
  );

  function handleSelectedProductCatalog() {
    if (isProductSelectedCatalog) {
      onRemoveProduct(product);
    } else {
      onSelectedProduct(product);
    }
  }

  const MotionBox = motion(Box);
  return (
    <MotionBox
      bg="white"
      px="4"
      py="4"
      borderRadius="md"
      boxShadow="base"
      // transition="box-shadow .4s ease-in-out,-webkit-box-shadow .2s ease-in-out;"
      _hover={{
        textDecoration: "none",
      }}
      whileHover={{ boxShadow: "0px 10px 15px 4px rgba(0,0,0,0.20)" }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.95 }}

      // initial={{ opacity: 0.8 }}
      // whileInView={{ opacity: 1 }}
      // border="2px solid "
      // borderColor="blue.600"
    >
      <Flex
        position="relative"
        flexDir="column"
        pt="2rem"
        alignItems="start"
        h="full"
      >
        {isActivatedProductCatalog && (
          <Box position="absolute" top="0" left="0">
            <Button
              h="2.5rem"
              w="2.5rem"
              p="0"
              borderRadius="full"
              onClick={handleSelectedProductCatalog}
            >
              <Icon
                as={isProductSelectedCatalog ? BsBookmarkFill : BsBookmark}
                fontSize="20"
                color={isProductSelectedCatalog ? "blue.600" : "gray.700"}
              />
            </Button>
          </Box>
        )}

        {/* 
        <Box position="absolute" top="0" right="0">
          <Button h="2.5rem" w="2.5rem" p="0" borderRadius="full">
            <Icon
              as={IoMdHeartEmpty} //IoIosHeart
              fontSize="20"
            />
          </Button> 
        </Box>*/}
        <Link href={`/produtos/${cod}`} passHref>
          <ChakraLink _hover={{}} w="100%">
            <Flex w="full" flexDirection="column" align="center">
              <Image
                height="10rem"
                src={uri}
                objectFit="contain"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
                }}
              />
            </Flex>

            <Box>
              <Text mt="4" fontSize="md" fontWeight="light">
                {name}
              </Text>

              <Flex flexDir="column" mb="1.5">
                {/* <Text
                  as="span"
                  fontSize="smaller"
                  color="gray.600"
                  fontWeight="light"
                  whiteSpace="nowrap"
                >
                  Cód. Produto #{cod}
                </Text> */}
                <Text
                  as="span"
                  fontSize="smaller"
                  color="gray.600"
                  fontWeight="light"
                  mb="4"
                >
                  Referência {reference}
                </Text>
              </Flex>
              <Text fontSize="sm" fontWeight="bold">
                PDV {priceSale}
              </Text>
            </Box>
          </ChakraLink>
        </Link>
      </Flex>
    </MotionBox>
  );
}

export const Product = memo(ProductComponent, (prevProps, nextProps) =>
  Object.is(prevProps.product, nextProps.product)
);
