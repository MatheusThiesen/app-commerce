import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
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
import { VariationsProduct } from "../../components/VariationsProduct";
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

  const InfoProduct = () => (
    <>
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

      {product?.variacoes && product?.variacoes?.length >= 1 && (
        <VariationsProduct
          variationsProduct={product.variacoes}
          currentReference={product?.referencia ?? ""}
        />
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
          Locais de estoque
        </Text>
        <Table size="sm" variant="simple">
          {(product?.locaisEstoque?.length ?? 0) <= 0 && (
            <TableCaption>Sem dados</TableCaption>
          )}

          <Thead>
            <Tr>
              <Th>Período</Th>
              <Th>Estoque</Th>
            </Tr>
          </Thead>
          {
            <Tbody>
              {product?.locaisEstoque?.map((localEstoque) => (
                <Tr key={localEstoque.id}>
                  <Td>{localEstoque.descricao}</Td>

                  <Td>
                    {/* {localEstoque.quantidade >= 1
                      ? "Disponível"
                      : "Indisponível"} */}
                    {localEstoque.quantidade}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          }
        </Table>
      </TableContainer>
    </>
  );

  return (
    <>
      <Head>
        <title> Produto | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        user={{ name: props.me.email }}
      />

      {isLoading && product ? (
        <Flex h="100vh" w="100%" justify="center" align="center">
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
              align="center"
              maxW="1200px"
              px={["0", "0", "0", "4"]}
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
                flexDir={[
                  "column-reverse",
                  "column-reverse",
                  "column-reverse",
                  "row",
                ]}
                pt={["0", "0", "0", "2"]}
                pl={["0", "0", "0", "2"]}
                pr={["0", "0", "0", "2"]}
                w="full"
                bg="white"
                borderRadius="md"
                shadow="md"
                mb="5rem"
              >
                <Box
                  w={["100%", "100%", "100%", "65%"]}
                  pr={["0", "0", "0", "2"]}
                >
                  {images.length <= 0 ? (
                    <Flex h="26rem" w="full" justify="center" align="center">
                      <Spinner ml={["0", "0", "0", "4"]} size="xl" />
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

                  <Box display={["block", "block", "block", "none"]} p="1rem">
                    <InfoProduct />
                  </Box>

                  <Box p="1rem">
                    <Divider />

                    <Box>
                      <Text
                        as="h2"
                        mt="4"
                        fontSize={["2xl", "2xl", "3xl"]}
                        fontWeight="light"
                      >
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
                  w={["100%", "100%", "100%", "35%"]}
                  borderColor="gray.100"
                  borderWidth={[0, 0, 0, "1px"]}
                  borderRadius="lg"
                  px="4"
                  pt="4"
                  pb={["0", "0", "0", "10"]}
                >
                  <Box position="sticky" top="4">
                    <Text
                      as="p"
                      fontSize="sm"
                      fontWeight="light"
                      color="gray.600"
                      display={["block", "block", "block", "none"]}
                    >
                      Referência {product?.referencia}
                    </Text>
                    <Text as="h1" fontSize="2xl" fontWeight="bold">
                      {product?.descricao}
                    </Text>
                    <Text
                      as="p"
                      fontSize="sm"
                      fontWeight="light"
                      color="gray.600"
                      display={["none", "none", "none", "block"]}
                    >
                      Referência {product?.referencia}
                    </Text>

                    <Box display={["none", "none", "none", "block"]}>
                      <InfoProduct />
                    </Box>
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
