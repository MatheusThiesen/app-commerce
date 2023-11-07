import {
  Box,
  Flex,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { memo } from "react";
import { defaultNoImage } from "../../global/parameters";
import { ProductPage } from "../../hooks/queries/useCatalog";

interface PageCatalogProps {
  product: ProductPage;
  type?: "small" | "medium";
}

interface InfoProductProps {
  reference?: string;
  alternativeCod?: string;
  description?: string;
  colors?: string;
  pdv?: string;
}

export function PageCatalog({ product, type }: PageCatalogProps) {
  const InfoProduct = ({
    alternativeCod,
    reference,
    description,
    colors,
    pdv,
  }: InfoProductProps) => {
    return (
      <Flex
        justify="space-between"
        flexDir={["column", "column", "row", "row"]}
      >
        <Box>
          {alternativeCod && (
            <Text color="#555" fontSize="sm">
              Cód. Agrupador: {alternativeCod}
            </Text>
          )}
          {reference && (
            <Text color="#555" fontSize="sm">
              Referência: {reference}
            </Text>
          )}

          {description && (
            <Text fontSize={type ? "lg" : ["lg", "lg", "lg", "3xl"]}>
              {description}
            </Text>
          )}
          {colors && (
            <Text color="#555" fontSize="sm">
              Cor: {colors}
            </Text>
          )}
        </Box>

        <Text
          fontSize={type === "small" ? "md" : "larger"}
          as="span"
          bg="white"
          fontWeight="normal"
        >
          PDV Sugerido:{" "}
          <Text
            as="span"
            fontSize={type === "small" ? "md" : "larger"}
            fontWeight="bold"
          >
            {pdv}
          </Text>
        </Text>
      </Flex>
    );
  };

  return (
    <Flex
      justify="space-between"
      flexDir={"column"}
      w="100%"
      h="100%"
      maxW={"100%"}
      maxH="100%"
      bg="white"
      px="4"
      py="4"
      overflow="hidden"
      borderRadius="md"
    >
      <Flex flex="1" h="100%" w="100%" flexDir="column">
        <InfoProduct
          alternativeCod={
            product.isGroupProduct ? product.alternativeCode : undefined
          }
          colors={!product.isGroupProduct ? product.colors : undefined}
          description={product.description}
          reference={!product.isGroupProduct ? product.reference : undefined}
          pdv={product.price}
        />

        <Flex
          w={"100%"}
          align="center"
          justify="center"
          h={
            type === "small"
              ? "44"
              : type === "medium"
              ? ["28", "44", "56", "64"]
              : ["36", "56", "64", "80"]
          }
          mt="6"
        >
          <Image
            w={"100%"}
            maxH={["100%"]}
            src={product.imageMain}
            objectFit="contain"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultNoImage;
            }}
          />
        </Flex>

        {product.isGroupProduct && (
          <Flex
            columnGap="1"
            rowGap="1"
            flexWrap="wrap"
            mt="2"
            justify="center"
          >
            {product.variations?.map((variation) => (
              <Box
                key={variation.reference}
                borderRadius="md"
                border="1px solid #888"
                p="1.5px"
              >
                <Image
                  src={variation.imageMain + "_smaller"}
                  height={type === "small" ? "10" : ["10", "20", "24", "24"]}
                  maxWidth={["12", "20", "20", "28"]}
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

        {type !== "small" && (
          <Flex
            flexDir={["column", "column", "column", "row"]}
            justify="space-evenly"
            pl={["0", "0", "0", "1rem"]}
          >
            {!product.isGroupProduct && (
              <Box mt="2">
                <Text fontSize="lg" mb="4" mt="4">
                  DISPONIBILIDADE
                </Text>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap="2"
                  justify="center"
                  align="center"
                >
                  {product.grids.map((grid) => {
                    return (
                      <TableContainer
                        borderWidth="1px"
                        borderColor="blackAlpha.400"
                        borderRadius="md"
                      >
                        <Table
                          size={type === "medium" ? "xs" : "sm"}
                          variant="simple"
                        >
                          <Thead>
                            <Tr>
                              <Th fontSize={type === "medium" ? "xs" : "sm"}>
                                TAM. {grid.name}
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {grid?.stocks?.map((stock) => (
                              <Tr>
                                <Td
                                  fontSize={type === "medium" ? "xs" : "sm"}
                                  textAlign="center"
                                >
                                  {stock.description === "Pronta Entrega"
                                    ? `${stock.description} : ${stock.qtd} qtd`
                                    : `${stock.description}`}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    );
                  })}
                </Stack>
              </Box>
            )}

            <Box mt="2">
              <Text fontSize="lg" mb="4" mt="4">
                CARACTERÍSTICAS GERAIS
              </Text>

              <Table size={type === "medium" ? "xs" : "sm"} variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>Marca</Td>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>
                      {product.brand}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>Gênero</Td>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>
                      {product.genre}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>Linha</Td>
                    <Td fontSize={type === "medium" ? "xs" : "sm"}>
                      {product.line}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export const Product = memo(PageCatalog, (prevProps, nextProps) =>
  Object.is(prevProps.product, nextProps.product)
);
