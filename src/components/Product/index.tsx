import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
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
  isCatalog?: boolean;
  href: string;
  hrefBack?: string;
  onClickProduct?: () => void;
  onAddCard?: (product: ProductProps) => void;
}

export function ProductComponent({
  product,
  isCatalog,
  href,
  hrefBack,
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
        <Link href={`/${href}/${cod}?hrefBack=${hrefBack}`} passHref>
          <Flex
            as="a"
            flexDir="column"
            justifyContent="space-between"
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
                minH="44"
                maxH="44"
                src={uri}
                objectFit="contain"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultNoImage;
                }}
              />
            </Flex>

            <Box w="full">
              <Text
                w="full"
                mt="4"
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
          </Flex>
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
