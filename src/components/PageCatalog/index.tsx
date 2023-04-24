import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { memo } from "react";
import { ProductPage } from "../../hooks/queries/useCatalog";

interface PageCatalogProps {
  product: ProductPage;
  date: string;
}

export function PageCatalog({ product, date }: PageCatalogProps) {
  return (
    <Box
      flexDir={"column"}
      maxW={["none", "none", "100%", "100%"]}
      // maxH="100%"
      w="297mm"
      h="209mm"
      bg="white"
      px="4"
      py="4"
      overflow="hidden"
      className="break"
    >
      <Box as="header" h="5%" w="100%" />

      <Flex h="85%" w="100%">
        <Flex w="60%">
          <Image
            src={product.imageMain}
            objectFit="contain"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
            }}
          />
        </Flex>

        <Flex w="40%" flexDir={"column"} pl="2rem">
          <Box>
            <Text color="#555" fontSize="1rem">
              Referência: {product.reference}
            </Text>
            <Text fontSize="2.5rem" lineHeight="2.8rem">
              {product.description}
            </Text>
            <Text color="#555" fontSize="0.875rem" mt="0.5rem">
              Cor: {product.colors}
            </Text>
          </Box>

          <Box mt="1rem">
            <Text fontSize="1.5rem">GRADES</Text>
            {product.grids.map((grid) => (
              <Text color="#444" fontSize={"0.855rem"}>
                {grid.name}
              </Text>
            ))}
          </Box>

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
        h="10%"
        w="100%"
        align={"flex-end"}
        justify={"space-between"}
      >
        <Text as="span" fontWeight="bold" fontSize="0.875rem">
          * PRODUTOS ESTÃO SUJEITOS A ALTERAÇÕES CONFORME DISPONIBILIDADE *
        </Text>
        <Text as="span" fontSize="0.875rem">
          Data de criação {date}
        </Text>
      </Flex>
    </Box>
  );
}

export const Product = memo(PageCatalog, (prevProps, nextProps) =>
  Object.is(prevProps.product, nextProps.product)
);