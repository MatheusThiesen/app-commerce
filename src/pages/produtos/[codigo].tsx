import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  HStack,
  Image,
  Link as CharkraLink,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoChevronForwardSharp } from "react-icons/io5";
import xml2js from "xml2js";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductCarousel } from "../../components/ProductCarousel";
import { getProductOne, Product } from "../../hooks/queries/useProducts";
import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

type ResponseXmlToJson = {
  ListBucketResult: {
    Contents: {
      Key: string[];
    }[];
  };
};

interface ProdutoProps {
  product?: Product;
  images?: string[];
  me: Me;
}

export default function Produto(props: ProdutoProps) {
  const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";
  const {} = useRouter();
  if (!props) return "Loading";

  return (
    <>
      <Head>
        <title>Produtos - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        user={{ name: props.me.email }}
      />

      <Flex flexDir="column" align="center" width="full" mt="8">
        <Flex flexDir="column" width="full" maxW="1200px" px="4" align="center">
          <Flex w="full" mb="2" align="center">
            <Link href="/produtos">
              <CharkraLink h="full" color="gray.600">
                Voltar à listagem
              </CharkraLink>
            </Link>

            <Divider h="1rem" mx="2" orientation="vertical" />

            <Breadcrumb
              spacing="8px"
              separator={<IoChevronForwardSharp color="gray.500" />}
            >
              <BreadcrumbItem>
                <Link href={`/produtos/${props.product?.codigo}`}>
                  <BreadcrumbLink>{props.product?.descricao}</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>

              {/* <BreadcrumbItem>
                <Link href="/produtos?genero=masculino">
                  <BreadcrumbLink>Calçados</BreadcrumbLink>
                </Link>
              </BreadcrumbItem> */}
            </Breadcrumb>
          </Flex>

          <Flex
            flexDir={["column", "column", "column", "row"]}
            p="2"
            w="full"
            bg="white"
            borderRadius="md"
            shadow="md"
          >
            <Box w={["100%", "100%", "100%", "60%"]} pr="8">
              <ProductCarousel
                bg="white"
                h="26rem"
                banners={
                  props.images?.map((image, index) => ({
                    id: index.toString(),
                    name: props.product?.descricao ?? "-",
                    uri: image,
                  })) ?? []
                }
              />

              <Box>
                <Divider />
                <Text as="h2" mt="4" fontSize="2xl" fontWeight="light">
                  Características do produto
                </Text>

                {props.product?.descricaoAdicional}
              </Box>
            </Box>

            <Box
              w={["100%", "100%", "100%", "40%"]}
              px="6"
              pt="4"
              pb="10"
              borderColor="gray.100"
              borderWidth={[0, 0, 0, "1px"]}
              borderRadius="lg"
            >
              <Text as="h1" fontSize="2xl" fontWeight="bold">
                {props.product?.descricao}
              </Text>
              <Text as="p" fontSize="sm" fontWeight="light" color="gray.600">
                Referência {props.product?.referencia}
              </Text>
              <Text as="span" fontSize="2xl" fontWeight="medium">
                PDV {props.product?.precoVendaFormat}
              </Text>
              <Text as="p" fontSize="small" mt="2" fontWeight="light">
                Cor:{" "}
                <Text as="span" fontSize="small" mt="2" fontWeight="bold">
                  {props.product?.corPrimaria?.descricao}
                  {props.product?.corSecundaria?.cor.descricao
                    ? ` e ${props.product?.corSecundaria?.cor.descricao}`
                    : ""}
                </Text>
              </Text>

              {props.product?.variacoes && (
                <HStack spacing={1}>
                  {props.product?.variacoes?.map((variation) => (
                    <Link
                      href={`/produtos/${variation.codigo}`}
                      key={variation.codigo}
                      passHref
                    >
                      <Box
                        as="a"
                        w="4rem"
                        h="4rem"
                        borderRadius="md"
                        cursor={
                          props.product?.referencia === variation.referencia
                            ? "auto"
                            : "pointer"
                        }
                        borderWidth={
                          props.product?.referencia === variation.referencia
                            ? "2px"
                            : "1px"
                        }
                        borderColor={
                          props.product?.referencia === variation.referencia
                            ? "blue.500"
                            : "gray.200"
                        }
                      >
                        <Image
                          w="full"
                          h="full"
                          objectFit="contain"
                          src={`${spaceImages}/Produtos/${variation.referencia}_01`}
                          alt={variation.descricao}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src =
                              "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
                          }}
                        />
                      </Box>
                    </Link>
                  ))}
                </HStack>
              )}

              <TableContainer mt="6" w="60%">
                <Text mb="3" fontSize="lg">
                  Estoque
                </Text>
                <Table size="sm" variant="simple">
                  {(props.product?.locaisEstoque?.length ?? 0) <= 0 && (
                    <TableCaption>Sem dados</TableCaption>
                  )}

                  <Thead>
                    <Tr>
                      <Th>Período</Th>
                      <Th isNumeric>Qtd</Th>
                    </Tr>
                  </Thead>
                  {
                    <Tbody>
                      {props.product?.locaisEstoque?.map((localEstoque) => (
                        <Tr key={localEstoque.id}>
                          <Td>{localEstoque.descricao}</Td>

                          <Td isNumeric>{localEstoque.quantidade}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  }
                </Table>
              </TableContainer>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/auth/me");

  const product = await getProductOne(Number(ctx.query.codigo), ctx);
  var images: string[] = [];
  if (product) {
    const response = await axios(
      `https://alpar.sfo3.digitaloceanspaces.com/?prefix=Produtos%2F${product.referencia}&max-keys=10`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
    const xmlToJson = (await xml2js.parseStringPromise(
      response.data
    )) as ResponseXmlToJson;
    images = xmlToJson?.ListBucketResult?.Contents?.map(
      (key) => "https://alpar.sfo3.digitaloceanspaces.com" + "/" + key?.Key[0]
    );
  }

  return {
    props: {
      product,
      images,
      me: response.data,
    },
  };
});
