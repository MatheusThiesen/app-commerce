import { api } from "@/service/apiClient";
import { Link } from "@chakra-ui/next-js";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { memo } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import {
  MdCollectionsBookmark,
  MdOutlineCollectionsBookmark,
} from "react-icons/md";
import { defaultNoImage } from "../../global/parameters";
import { useProductCatalog } from "../../hooks/useProductCatalog";

export interface ProductProps {
  cod: number;
  name: string;
  descriptionAdditional: string;
  amount: string;
  subInfo?: string;
  reference: string;
  uri: string;
}
interface ProductComponentProps {
  product: ProductProps;
  href: string;
  hrefBack?: string;
  isCatalog?: boolean;
  onClickProduct?: () => void;
  onAddCard?: (product: ProductProps) => void;
}

export function ProductComponent({
  product,
  isCatalog,
  href,
  hrefBack = "",
  onClickProduct,
  onAddCard,
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

  async function handleClickProduct() {
    try {
      await api.patch(`/products/click/${product.cod}`);
    } catch (error) {
      console.log("Error save click product: ", error);
    }
  }

  const MotionBox = motion(Box);
  return (
    <MotionBox
      h="full"
      bg="white"
      px="2"
      py="2"
      borderRadius="6px"
      boxShadow="base"
      _hover={{
        textDecoration: "none",
      }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClickProduct}
    >
      <Flex position="relative" flexDir="column" alignItems="start" h="full">
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
                as={
                  isProductSelectedCatalog
                    ? MdCollectionsBookmark
                    : MdOutlineCollectionsBookmark
                }
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

        <Link
          href={`/${href}/${cod}?hrefBack=${hrefBack}`}
          as="a"
          flexDir="column"
          justifyContent="space-between"
          _hover={{
            textDecor: "none",
          }}
          mt={isCatalog ? "4" : 0}
          w="100%"
          flex={1}
          onClick={() => {
            if (onClickProduct) onClickProduct();
          }}
        >
          <Flex
            w="full"
            flexDirection="column"
            align="center"
            justify="center"
            flex={1}
          >
            <Image
              w="full"
              minH="13rem"
              maxH="13rem"
              src={uri}
              objectFit="contain"
              objectPosition="50% 50%"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = defaultNoImage;
              }}
            />
          </Flex>

          <Box w="95%">
            <Text
              w="full"
              mt="1"
              fontSize="md"
              fontWeight="400"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
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
              {product.subInfo && (
                <Text
                  as="span"
                  fontSize="smaller"
                  color="gray.600"
                  fontWeight="light"
                >
                  {product.subInfo}
                </Text>
              )}
            </Flex>
            <Text fontSize="lg" fontWeight="bold">
              {amount}
            </Text>
          </Box>
        </Link>

        {onAddCard && (
          <Button
            onClick={() => onAddCard(product)}
            leftIcon={<Icon as={FaCartArrowDown} fontSize="24" />}
            mt="4"
            w="full"
            bg="primary"
            _hover={{ bg: "primary.hover" }}
            colorScheme="red"
            color="white"
            size="md"
            type="button"
          >
            Comprar
          </Button>
        )}
      </Flex>
    </MotionBox>
  );
}

export const Product = memo(
  ProductComponent,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product) &&
    prevProps.href === nextProps.href &&
    prevProps.hrefBack === nextProps.hrefBack
);
