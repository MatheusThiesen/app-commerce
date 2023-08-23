import {
  Box,
  Flex,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { memo } from "react";
import { defaultNoImage } from "../../global/parameters";
import { ProductPage } from "../../hooks/queries/useCatalog";

interface PageCatalogProps {
  product: ProductPage;
  date: string;
}

interface InfoProductProps {
  reference?: string;
  alternativeCod?: string;
  description?: string;
  colors?: string;
}

const InfoProduct = ({
  alternativeCod,
  reference,
  description,
  colors,
}: InfoProductProps) => {
  return (
    <Box mt={["3rem", "3rem", "3rem", "0"]}>
      {alternativeCod && (
        <Text color="#555" fontSize="1rem">
          Cód. Agrupador: {alternativeCod}
        </Text>
      )}
      {reference && (
        <Text color="#555" fontSize="1rem">
          Referência: {reference}
        </Text>
      )}

      {description && (
        <Text
          fontSize={["1.8rem", "1.8rem", "1.8rem", "2.5rem"]}
          lineHeight={["1.8rem", "1.8rem", "1.8rem", "2.8rem"]}
        >
          {description}
        </Text>
      )}
      {colors && (
        <Text color="#555" fontSize="0.875rem">
          Cor: {colors}
        </Text>
      )}
    </Box>
  );
};

export function PageCatalog({ product, date }: PageCatalogProps) {
  return (
    <Flex
      justify="space-between"
      flexDir={"column"}
      w="100%"
      h="100%"
      maxW={"100%"}
      maxH="100%"
      minH={["auto", "auto", "auto", "80vh"]}
      bg="white"
      px="4"
      py="4"
      overflow="hidden"
      borderRadius="md"
    >
      <Flex
        flex="1"
        h="90%"
        w="100%"
        flexDir={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          align={"center"}
          justify="center"
          maxH={["26rem", "26rem", "100%", "100%"]}
          h={["10rem", "22rem", "auto", "auto"]}
        >
          <Image
            w={["75%", "75%", "75%", "100%"]}
            maxH={["100%", "100%", "100%", "80vh"]}
            src={product.imageMain}
            objectFit="contain"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultNoImage;
            }}
          />
        </Flex>

        <Flex flexDir={"column"} pl={["0", "0", "0", "1rem"]}>
          <InfoProduct
            alternativeCod={
              product.isGroupProduct ? product.alternativeCode : undefined
            }
            colors={!product.isGroupProduct ? product.colors : undefined}
            description={product.description}
            reference={!product.isGroupProduct ? product.reference : undefined}
          />

          {product.isGroupProduct && (
            <Flex columnGap="1" rowGap="1" flexWrap="wrap">
              {product.variations?.map((variation) => (
                <Box
                  key={variation.reference}
                  borderRadius="md"
                  border="1.5px solid black"
                  p="1.5px"
                >
                  <Image
                    src={variation.imageMain}
                    height="75px"
                    maxWidth="75px"
                    objectFit="contain"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultNoImage;
                    }}
                  />
                </Box>
              ))}
            </Flex>
          )}

          {!product.isGroupProduct && (
            <Box mt="1rem">
              <Text fontSize="1.5rem">GRADES</Text>
              {product.grids.map((grid) => (
                <Text color="#444" fontSize={"0.855rem"}>
                  {grid.name}

                  {product.isStockLocation && (
                    <UnorderedList ml="2rem">
                      {grid.stocks?.map((stock) => (
                        <ListItem>{`${stock.description} : ${stock.qtd} qtd`}</ListItem>
                      ))}
                    </UnorderedList>
                  )}
                </Text>
              ))}
            </Box>
          )}

          <Box mt="1rem">
            <Text fontSize="1.5rem">CARACTERÍSTICAS GERAIS</Text>

            <Box w="15rem">
              <Flex justify="space-between">
                <Text color="#444" fontSize={"0.855rem"}>
                  Marca
                </Text>
                <Text color="#444" fontSize={"0.855rem"} fontWeight="bold">
                  {product.brand}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#444" fontSize={"0.855rem"}>
                  Gênero
                </Text>
                <Text color="#444" fontSize={"0.855rem"} fontWeight="bold">
                  {product.genre}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="#444" fontSize={"0.855rem"}>
                  Linha
                </Text>
                <Text color="#444" fontSize={"0.855rem"} fontWeight="bold">
                  {product.line}
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <Flex
        as="footer"
        align={"flex-end"}
        justify={"space-between"}
        mt={["1rem", "2rem", "4rem", "0"]}
      >
        <Text
          as="p"
          fontWeight="bold"
          fontSize={["0.675rem", "0.675rem", "sm", "sm"]}
        >
          * PRODUTOS ESTÃO SUJEITOS A ALTERAÇÕES CONFORME DISPONIBILIDADE *
        </Text>
        <Text as="p" fontSize={["0.675rem", "0.675rem", "0.675rem", "smaller"]}>
          Data de criação {date}
        </Text>
      </Flex>
    </Flex>
  );
}

export const Product = memo(PageCatalog, (prevProps, nextProps) =>
  Object.is(prevProps.product, nextProps.product)
);
