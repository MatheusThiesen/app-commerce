import { Box, Button, Flex, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { IoBook } from "react-icons/io5";
import { HeaderNavigation as Header } from "../../components/HeaderNavigation";
import { Product } from "../../components/Product";

export default function Home() {
  const [headerSizeY, setHeaderSizeY] = useState("");

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

      <Header
        title="Produtos"
        getHeaderY={(value) => setHeaderSizeY(value)}
        childrenSizeY={2.5}
        Right={
          <Button colorScheme="none" display="flex" alignItems="center">
            <IoBook fontSize={"20"} color="white" />
          </Button>
        }
      >
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
      </Header>

      <Box pt={headerSizeY} pb={"4"}>
        <Box px="2" py="3">
          <SimpleGrid columns={[2, 2, 4, 6]} spacing="1">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
