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
  Spinner,
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
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import Select from "react-select";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductCarousel } from "../../components/ProductCarousel";
import { useProductOne } from "../../hooks/queries/useProducts";
import { useImagesProduct } from "../../hooks/useImagesProduct";
import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface ProdutoProps {
  me: Me;
}

export default function Produto(props: ProdutoProps) {
  const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";
  const router = useRouter();
  const { codigo } = router.query;
  const [images, setImages] = useState<string[]>([]);

  const { data: product, isLoading } = useProductOne(Number(codigo));

  useEffect(() => {
    (async () => {
      if (product) {
        const getImages = await useImagesProduct({
          reference: product.referencia,
        });
        setImages(getImages);
      }
    })();
  }, [product]);

  return (
    <>
      <Head>
        <title> Produtos - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        user={{ name: props.me.email }}
      />

      {isLoading ? (
        <Flex h="100vh" w="100vw" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      ) : (
        <>
          <Flex
            flexDir="column"
            align="center"
            width="full"
            mt={["0", "0", "0", "8"]}
          >
            <Flex
              flexDir="column"
              width="full"
              maxW="1200px"
              px={["0", "0", "0", "4"]}
              align="center"
            >
              <Flex
                w="full"
                mb="2"
                align="center"
                display={["none", "none", "none", "flex"]}
              >
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
                    <Link href={`/produtos/${product?.codigo}`}>
                      <BreadcrumbLink>{product?.descricao}</BreadcrumbLink>
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
                pt="2"
                pl="2"
                w="full"
                bg="white"
                borderRadius="md"
                shadow="md"
                mb="5rem"
              >
                <Box
                  w={["100%", "100%", "100%", "60%"]}
                  pr={["0", "0", "0", "2"]}
                >
                  {images.length <= 0 ? (
                    <Flex h="26rem" w="full" justify="center" align="center">
                      <Spinner ml="4" size="xl" />
                    </Flex>
                  ) : (
                    <ProductCarousel
                      bg="white"
                      h="26rem"
                      banners={
                        images?.map((image, index) => ({
                          id: index.toString(),
                          name: product?.descricao ?? "-",
                          uri: image,
                        })) ?? []
                      }
                    />
                  )}

                  <Box p="1rem">
                    <Divider />

                    <Box p="1rem">
                      <Text as="h2" mt="4" fontSize="3xl" fontWeight="light">
                        Características do produto
                      </Text>

                      <Text
                        mb="8"
                        fontSize="sm"
                        fontWeight="light"
                        color="gray.600"
                      >
                        {product?.descricaoComplementar}
                      </Text>

                      <Box w={["100%", "100%", "100%", "60%"]}>
                        <Text as="h2" mb="2" fontSize="lg" fontWeight="light">
                          Características gerais
                        </Text>

                        <Table size="sm" variant="striped">
                          <Tbody>
                            <Tr>
                              <Td>Marca</Td>
                              <Td>{product?.marca.descricao}</Td>
                            </Tr>
                            <Tr>
                              <Td>Coleção</Td>
                              <Td>{product?.colecao?.descricao}</Td>
                            </Tr>
                            <Tr>
                              <Td>Linha</Td>
                              <Td>{product?.linha?.descricao}</Td>
                            </Tr>
                            <Tr>
                              <Td>Grupo</Td>
                              <Td>{product?.grupo?.descricao}</Td>
                            </Tr>
                            <Tr>
                              <Td>Subgrupo</Td>
                              <Td>{product?.subGrupo?.descricao}</Td>
                            </Tr>
                            <Tr>
                              <Td>Gênero</Td>
                              <Td>{product?.genero?.descricao}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box
                  w={["100%", "100%", "100%", "40%"]}
                  borderColor="gray.100"
                  borderWidth={[0, 0, 0, "1px"]}
                  borderRadius="lg"
                  px="4"
                  pt="4"
                  pb="10"
                >
                  <Box position="sticky" top="4">
                    <Text as="h1" fontSize="2xl" fontWeight="bold">
                      {product?.descricao}
                    </Text>
                    <Text
                      as="p"
                      fontSize="sm"
                      fontWeight="light"
                      color="gray.600"
                    >
                      Referência {product?.referencia}
                    </Text>
                    <Text as="span" fontSize="2xl" fontWeight="medium">
                      PDV {product?.precoVendaFormat}
                    </Text>
                    <Text as="p" fontSize="small" mt="2" fontWeight="light">
                      Cor:{" "}
                      <Text as="span" fontSize="small" mt="2" fontWeight="bold">
                        {product?.corPrimaria?.descricao}
                        {product?.corSecundaria?.cor.descricao
                          ? ` e ${product?.corSecundaria?.cor.descricao}`
                          : ""}
                      </Text>
                    </Text>
                    {product?.variacoes && (
                      <HStack spacing={1}>
                        {product?.variacoes?.map((variation) => (
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
                              // onClick={() => setImages([])}
                              cursor={
                                product?.referencia === variation.referencia
                                  ? "auto"
                                  : "pointer"
                              }
                              borderWidth={
                                product?.referencia === variation.referencia
                                  ? "2px"
                                  : "1px"
                              }
                              borderColor={
                                product?.referencia === variation.referencia
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

                    <Box mt="4">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={product?.grades?.map((grade) => ({
                          value: grade.codigo,
                          label: grade.descricaoAdicional,
                        }))}
                        defaultValue={{
                          value: product?.codigo,
                          label: product?.descricaoAdicional,
                        }}
                        onChange={(e) => router.push(`/produtos/${e?.value}`)}
                      />
                    </Box>
                    <TableContainer mt="6" w="70%">
                      <Text mb="3" fontSize="lg">
                        Metas
                      </Text>
                      <Table size="sm" variant="simple">
                        {(product?.locaisEstoque?.length ?? 0) <= 0 && (
                          <TableCaption>Sem dados</TableCaption>
                        )}

                        <Thead>
                          <Tr>
                            <Th>Período</Th>
                            <Th>Meta</Th>
                          </Tr>
                        </Thead>
                        {
                          <Tbody>
                            {product?.locaisEstoque?.map((localEstoque) => (
                              <Tr key={localEstoque.id}>
                                <Td>{localEstoque.descricao}</Td>

                                <Td>
                                  {localEstoque.quantidade >= 1
                                    ? "Disponível"
                                    : "Indisponível"}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        }
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/auth/me");

  return {
    props: {
      me: response.data,
    },
  };
});
