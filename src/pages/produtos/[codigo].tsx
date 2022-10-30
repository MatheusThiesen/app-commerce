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
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoChevronForwardSharp } from "react-icons/io5";
import xml2js from "xml2js";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductCarousel } from "../../components/ProductCarousel";
import { getProductOne, Product } from "../../hooks/queries/useProducts";
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

      <HeaderNavigation isInativeEventScroll isGoBack title="Detalhes" />

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
                <Link href="/produtos">
                  <BreadcrumbLink>Produtos</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <Link href="/produtos?genero=masculino">
                  <BreadcrumbLink>Calçados</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
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
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
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
    props: { product, images },
  };
});
