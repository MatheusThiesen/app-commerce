import { Box, Button, Flex, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { IoBook } from "react-icons/io5";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { Product } from "../../components/Product";

export default function Home() {
  const products = [
    {
      id: "1",
      name: "NIKE TENIS WMNS QUEST 4 PRM",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DA8723001_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "2",
      name: "NIKE TENIS W COURT VISION ALTA LTR",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DM0113100_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "3",
      name: "NIKE TENIS AIR MAX AP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CU4826001_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "4",
      name: "NIKE BONE U AROBILL L91 CAP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/AV6953011_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "11",
      name: "NIKE TENIS WMNS QUEST 4 PRM",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DA8723001_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "22",
      name: "NIKE TENIS W COURT VISION ALTA LTR",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DM0113100_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "33",
      name: "NIKE TENIS AIR MAX AP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CU4826001_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
    {
      id: "44",
      name: "NIKE BONE U AROBILL L91 CAP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/AV6953011_01",
      reference: "DA8723001",
      priceSale: "R$ 249,99",
    },
  ];

  return (
    <>
      <Head>
        <title>Produtos - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        title="Produtos"
        Right={
          <Button colorScheme="none" display="flex" alignItems="center">
            <IoBook fontSize={"20"} color="white" />
          </Button>
        }
        contentHeight={2.5}
        content={
          <Flex w="full" justify="space-around">
            <Button bg="white" borderRadius={0} w="full">
              Ordenação
            </Button>
            <Button
              bg="white"
              borderRadius={0}
              borderLeft="1px solid #ccc"
              w="full"
            >
              Filtros
            </Button>
          </Flex>
        }
      />

      <Flex
        pt={["5.5rem", "5.5rem", "5.5rem", "7rem"]}
        justify="center"
        w="full"
      >
        <Flex w="full" maxW="1200px">
          <Box w="25rem" mr="3rem" bg="white" borderRadius="md"></Box>
          <Box w="full">
            <SimpleGrid columns={[2, 2, 4, 4]} spacing="1">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
