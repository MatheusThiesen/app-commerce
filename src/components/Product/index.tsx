import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { memo } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useProductCatalog } from "../../hooks/useProductCatalog";

export interface ProductProps {
  cod: number;
  name: string;
  descriptionAdditional: string;
  amount: string;
  pdv?: string;
  reference: string;
  uri: string;
}
interface ProductComponentProps {
  product: ProductProps;
  isCatalog?: boolean;
  href: string;
  onClickProduct?: () => void;
}

export function ProductComponent({
  product,
  isCatalog,
  href,
  onClickProduct,
}: ProductComponentProps) {
  const { productsSelected, onRemoveProduct, onSelectedProduct } =
    useProductCatalog();
  const { cod, name, reference, amount, uri } = product;

  const isProductSelectedCatalog = productsSelected.some(
    (produto) => reference === produto.reference
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
      h="full"
      bg="white"
      px="4"
      py="4"
      borderRadius="md"
      boxShadow="base"
      _hover={{
        textDecoration: "none",
      }}
      whileHover={{ boxShadow: "0px 10px 15px 4px rgba(0,0,0,0.20)" }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      // transition="box-shadow .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;"
      // border="2px solid"
      // borderColor="blue.600"
    >
      <Flex
        position="relative"
        flexDir="column"
        pt="2rem"
        alignItems="start"
        h="full"
      >
        {isCatalog && (
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

        {/* <Box position="absolute" top="0" right="0">
          <Button h="2.5rem" w="2.5rem" p="0" borderRadius="full">
            <Icon
              as={IoMdHeartEmpty} //IoIosHeart
              fontSize="20"
            />
          </Button>
        </Box> */}
        <Link href={`/${href}/${cod}`} passHref>
          <Box
            as="a"
            w="100%"
            onClick={() => {
              if (onClickProduct) onClickProduct();
            }}
          >
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
                {product.pdv && (
                  <Text
                    as="span"
                    fontSize="smaller"
                    color="gray.600"
                    fontWeight="light"
                  >
                    PDV {product.pdv}
                  </Text>
                )}
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                {amount}
              </Text>
            </Box>
          </Box>
        </Link>
      </Flex>
    </MotionBox>
  );
}

export const Product = memo(ProductComponent, (prevProps, nextProps) =>
  Object.is(prevProps.product, nextProps.product)
);
