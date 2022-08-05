import { Box, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { bottonNavigationY } from "../../components/BottonNavigation";
import { Header } from "../../components/Header";
import { Product } from "../../components/Product";
import { TitlesListing } from "../../components/TitlesListing ";

export default function Home() {
  const [headerSizeY, setHeaderSizeY] = useState("");

  const products = [
    {
      id: "1",
      name: "NIKE TENIS WMNS QUEST 4 PRM",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DA8723001_01",
    },
    {
      id: "2",
      name: "NIKE TENIS W COURT VISION ALTA LTR",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DM0113100_01",
    },
    {
      id: "3",
      name: "NIKE TENIS AIR MAX AP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CU4826001_01",
    },
    {
      id: "4",
      name: "NIKE BONE U AROBILL L91 CAP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/AV6953011_01",
    },
    {
      id: "11",
      name: "NIKE TENIS WMNS QUEST 4 PRM",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DA8723001_01",
    },
    {
      id: "22",
      name: "NIKE TENIS W COURT VISION ALTA LTR",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/DM0113100_01",
    },
    {
      id: "33",
      name: "NIKE TENIS AIR MAX AP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CU4826001_01",
    },
    {
      id: "44",
      name: "NIKE BONE U AROBILL L91 CAP",
      uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/AV6953011_01",
    },
  ];

  return (
    <>
      <Header getHeaderY={(value) => setHeaderSizeY(value)} childrenSizeY={2.5}>
        <TitlesListing title="PRODUTOS" />
      </Header>

      <Box pt={headerSizeY} pb={`calc(${bottonNavigationY} + 4rem)`}>
        <Box px="2" py="3">
          <SimpleGrid columns={[2, 2, 4]} spacing="3">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
