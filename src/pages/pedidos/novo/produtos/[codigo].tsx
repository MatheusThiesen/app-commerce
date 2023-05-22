import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Link as CharkraLink,
  Divider,
  Flex,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useNumberInput,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import ReactSelect from "react-select";
import { Me } from "../../../../@types/me";
import { InputQuantity } from "../../../../components/Form/InputQuantity";
import { HeaderNavigation } from "../../../../components/HeaderNavigation";
import { ProductCarousel } from "../../../../components/ProductCarousel";
import { VariationsProduct } from "../../../../components/VariationsProduct";
import { useStore } from "../../../../contexts/StoreContext";
import {
  StockLocation,
  useProductOne,
} from "../../../../hooks/queries/useProducts";
import { useImagesProduct } from "../../../../hooks/useImagesProduct";
import { setupAPIClient } from "../../../../service/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";

interface ProdutoProps {
  me: Me;
}

export default function Produto(props: ProdutoProps) {
  const router = useRouter();
  const { codigo } = router.query;
  const [images, setImages] = useState<string[]>([]);
  const [stockLocationSelected, setStockLocationSelected] = useState<
    StockLocation | undefined
  >();

  const { data: product, isLoading } = useProductOne(Number(codigo));

  const { priceList } = useStore();

  const {
    getInputProps: inputQuantityInputProps,
    getIncrementButtonProps: inputQuantityIncrementButtonProps,
    getDecrementButtonProps: inputQuantityDecrementButtonProps,
    value: quantity,
  } = useNumberInput({
    step: product?.qtdEmbalagem ?? 0,
    defaultValue: product?.qtdEmbalagem ?? 0,
    min: product?.qtdEmbalagem ?? 0,
    max: 120,
  });

  useEffect(() => {
    (async () => {
      if (product) {
        const getImages = await useImagesProduct({
          reference: product.referencia,
        });

        setImages(getImages ?? [""]);
      }
    })();
  }, [product]);

  const InfoProduct = () => {
    return (
      <>
        <Text as="span" fontSize="2xl" fontWeight="medium">
          {product?.listaPreco?.find(
            (f) => Number(f.codigo) === Number(priceList?.codigo)
          )?.valorFormat ?? "-"}
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
            uri={`/pedidos/novo/produtos`}
          />
        )}

        <Stack mt="4" spacing="4">
          <Box>
            <Text fontWeight="light">Grade</Text>
            <ReactSelect
              options={product?.grades?.map((grade) => ({
                value: grade.codigo,
                label: grade.descricaoAdicional,
              }))}
              defaultValue={{
                value: product?.codigo,
                label: product?.descricaoAdicional,
              }}
              onChange={(e) =>
                router.push(`/pedidos/novo/produtos/${e?.value}`)
              }
            />
          </Box>
          <Box>
            <Text fontWeight="light">Disponibilidade</Text>
            <ReactSelect
              placeholder="Selecionar"
              options={product?.locaisEstoque?.map((localEstoque) => ({
                value: localEstoque.periodo,
                label: localEstoque.descricao,
              }))}
              onChange={(e) =>
                setStockLocationSelected({
                  periodo: e?.value ?? "",
                  descricao: e?.label ?? "",
                })
              }
              value={
                stockLocationSelected
                  ? {
                      label: stockLocationSelected.descricao,
                      value: stockLocationSelected.periodo,
                    }
                  : undefined
              }
            />
          </Box>
          {stockLocationSelected && (
            <Box w="8rem">
              <InputQuantity
                inputProps={inputQuantityInputProps}
                incrementButtonProps={inputQuantityIncrementButtonProps}
                decrementButtonProps={inputQuantityDecrementButtonProps}
              />
              <Text
                mt="4"
                as={"span"}
                fontSize="sm"
                fontWeight="light"
                color="gray.500"
              >
                128 disponível
              </Text>
              {/* <Text>Ultimo disponível</Text> */}
            </Box>
          )}
        </Stack>

        <Button
          colorScheme="red"
          mt="6"
          size="lg"
          w="full"
          aria-disabled={!stockLocationSelected}
          disabled={!stockLocationSelected}
        >
          Adicionar ao carrinho
        </Button>
      </>
    );
  };

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
                    <Divider display={["none", "none", "none", "block"]} />

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
                        fontSize="medium"
                        fontWeight="light"
                        color="gray.600"
                      >
                        {product?.obs || product?.descricaoComplementar}
                      </Text>

                      <Box w={["100%", "100%", "100%", "60%"]} mb="2rem">
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

                      <Box w={["100%", "100%", "100%", "60%"]} mb="2rem">
                        <Text as="h2" mb="2" fontSize="lg" fontWeight="light">
                          Cadastro
                        </Text>

                        <Table size="sm" variant="striped">
                          <Tbody>
                            <Tr>
                              <Td>Código produto</Td>
                              <Td>{product?.codigo}</Td>
                            </Tr>
                            <Tr>
                              <Td>Código agrupador</Td>
                              <Td>{product?.codigoAlternativo}</Td>
                            </Tr>
                            <Tr>
                              <Td>Referência</Td>
                              <Td>{product?.referencia}</Td>
                            </Tr>
                            <Tr>
                              <Td>Preço de venda sugerido</Td>
                              <Td>{product?.precoVendaFormat}</Td>
                            </Tr>
                            <Tr>
                              <Td>NCM</Td>
                              <Td>{product?.ncmFormat || "-"}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>

                      <Box w={["100%", "100%", "100%", "60%"]}>
                        <Text as="h2" mb="2" fontSize="lg" fontWeight="light">
                          Estoque
                        </Text>

                        <Table size="sm" variant="striped">
                          <Tbody>
                            <Tr>
                              <Td>Acondicionamento</Td>
                              <Td>{product?.qtdEmbalagem}</Td>
                            </Tr>
                            <Tr>
                              <Td>Unidade medida</Td>
                              <Td>{product?.unidade?.unidade || "-"}</Td>
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
  var me = {};

  const response = await apiClient.get("/auth/me");
  me = response.data;

  return {
    props: {
      me: me,
    },
  };
});
