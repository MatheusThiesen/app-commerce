import { Cart } from "@/components/Cart";
import { InputQuantity } from "@/components/Form/InputQuantity";
import { ShoppingButton } from "@/components/ShoppingButton";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Icon,
  Select,
  Spinner,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { IoChevronForwardSharp } from "react-icons/io5";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductImageCarouse } from "../../components/ProductImageCarouse";
import { VariationsProduct } from "../../components/VariationsProduct";
import { useLoading } from "../../contexts/LoadingContext";
import {
  CLIENT_EMAILS_ACCEPT_STORE,
  spaceImages,
} from "../../global/parameters";
import { StockLocation, useProductOne } from "../../hooks/queries/useProducts";
import { useImagesProduct } from "../../hooks/useImagesProduct";

export default function Produto() {
  const router = useRouter();
  const { codigo, hrefBack } = router.query;
  const toast = useToast();
  const [images, setImages] = useState<string[]>([]);
  const { addItem, orders, totalItems, priceList } = useStore();
  const { data: product, isLoading } = useProductOne(Number(codigo));
  const { setLoading } = useLoading();
  const { user } = useAuth();

  const [stockLocationSelected, setStockLocationSelected] = useState<
    StockLocation | undefined
  >();

  const [quantity, setQuantity] = useState(0);

  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  function handleGoBack() {
    const hrefBack = router.query?.hrefBack;

    if (hrefBack && hrefBack !== "undefined") {
      router.push(String(hrefBack).replaceAll("!", "&"));
    } else {
      router.back();
    }
  }

  async function handleAddProductStore() {
    if (!product || !stockLocationSelected) {
      return toast({
        title: "Informe o produto e disponibilidade",
        status: "warning",
        position: "top",
        isClosable: true,
      });
    }

    addItem({
      product,
      qtd: quantity,
      stockLocation: stockLocationSelected,
      brand: product.marca,
    });

    return toast({
      title: "Produto adicionado no carrinho",
      status: "success",
      position: "top",
      isClosable: true,
    });
  }

  useEffect(() => {
    (async () => {
      if (product) {
        const getImages = await useImagesProduct({
          reference: product.referencia,
          images: product.imagens?.map((item) => item.nome),
        });

        setImages(getImages ?? [""]);

        setLoading(false);
      }
    })();
  }, [product]);

  useEffect(() => {
    if (product && stockLocationSelected) {
      const findOrder = orders.find(
        (f) => f.stockLocation.periodo === stockLocationSelected.periodo
      );

      if (!findOrder) return setQuantity(0);

      const findItem = findOrder.items.find(
        (f) => f.product.codigo === product.codigo
      );

      if (!findItem) return setQuantity(0);

      setQuantity(findItem.qtd);
    }
  }, [product, stockLocationSelected, orders]);

  const InfoProduct = () => (
    <>
      {user?.eCliente && CLIENT_EMAILS_ACCEPT_STORE.includes(user.email) && (
        <Text as="p" color="gray.600" fontSize="md" fontWeight="md" mt="2">
          {`${
            product?.listaPreco?.find(
              (f) => Number(f.codigo) === Number(priceList?.codigo)
            )?.valorFormat ?? "-"
          }`}
        </Text>
      )}

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
          uri={`/produtos`}
          hrefBack={hrefBack ? String(hrefBack) : undefined}
          onClick={() => {
            setImages([
              `${spaceImages}/Produtos/${
                product.imagemPreview
                  ? product.imagemPreview
                  : product.referencia + "_01"
              }_smaller`,
            ]);
            setLoading(true);
          }}
        />
      )}

      <Stack mt="4" spacing="4">
        <Box mt="4">
          <Text fontWeight="light">Grade</Text>
          <Select
            onChange={(e) => {
              if (Number(e?.target.value) !== product?.codigo) {
                setLoading(true);
                router.push(
                  `/produtos/${e?.target.value}?hrefBack=${hrefBack}`
                );
              }
            }}
            value={product?.codigo}
          >
            {product?.grades?.map((grid) => (
              <option key={grid.codigo} value={grid.codigo}>
                {grid.descricaoAdicional}
              </option>
            ))}
          </Select>
        </Box>
        {user?.eCliente && CLIENT_EMAILS_ACCEPT_STORE.includes(user.email) && (
          <>
            {product?.locaisEstoque && (
              <Box>
                <Text fontWeight="light">Disponibilidade</Text>
                <Select
                  value={stockLocationSelected?.periodo}
                  onChange={(e) => {
                    const findStockLocation = product?.locaisEstoque?.find(
                      (f) => String(f.periodo) === String(e?.target.value)
                    );

                    setStockLocationSelected(findStockLocation);
                  }}
                >
                  <option>Selecione...</option>
                  {product.locaisEstoque?.map((stockLocation) => (
                    <option value={stockLocation.periodo}>
                      {stockLocation.descricao}
                    </option>
                  ))}
                </Select>
              </Box>
            )}

            {stockLocationSelected && (
              <Box w="8rem">
                <InputQuantity
                  value={quantity}
                  step={product?.qtdEmbalagem}
                  max={stockLocationSelected?.quantidade}
                  min={product?.qtdEmbalagem}
                  onDecremental={(qtd) => setQuantity(qtd)}
                  onIncremental={(qtd) => setQuantity(qtd)}
                />
                <Text
                  mt="1"
                  as={"span"}
                  fontSize="sm"
                  fontWeight="light"
                  color="gray.500"
                  display="block"
                  textAlign="center"
                >
                  {stockLocationSelected?.quantidade
                    ? `${stockLocationSelected?.quantidade} disponível`
                    : "-"}
                </Text>
              </Box>
            )}

            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              leftIcon={<Icon as={FaCartPlus} fontSize={30} />}
              aria-disabled={!stockLocationSelected || !(Number(quantity) > 0)}
              disabled={!stockLocationSelected || !(Number(quantity) > 0)}
              onClick={() =>
                !stockLocationSelected || !(Number(quantity) > 0)
                  ? () => {}
                  : handleAddProductStore()
              }
            >
              Adicionar ao carrinho
            </Button>
          </>
        )}
      </Stack>

      <Divider mt="8" />

      <TableContainer mt="6" w="70%">
        <Text mb="3" fontSize="lg">
          Locais de Estoque
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
                    {user?.eCliente ? "Disponível" : localEstoque.quantidade}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          }
        </Table>
      </TableContainer>

      {!user?.eCliente && (
        <TableContainer mt="6">
          <Text mb="3" fontSize="lg">
            Lista de Preço
          </Text>
          <Table size="sm" variant="simple">
            {(product?.listaPreco?.length ?? 0) <= 0 && (
              <TableCaption>Sem dados</TableCaption>
            )}

            <Thead>
              <Tr>
                <Th>Lista</Th>
                <Th>Preço</Th>
              </Tr>
            </Thead>
            {
              <Tbody>
                {product?.listaPreco?.map((localEstoque) => (
                  <Tr key={localEstoque.id}>
                    <Td>{localEstoque.descricao}</Td>

                    <Td>{localEstoque.valorFormat}</Td>
                  </Tr>
                ))}
              </Tbody>
            }
          </Table>
        </TableContainer>
      )}
    </>
  );

  return (
    <>
      <Head>
        <title> Produto | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        onGoBack={handleGoBack}
        title="Detalhes"
        Right={
          user.eCliente &&
          CLIENT_EMAILS_ACCEPT_STORE.includes(user.email) && (
            <ShoppingButton
              qtdItens={totalItems}
              onClick={onOpenOrder}
              disabledTitle
            />
          )
        }
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
                <Button
                  onClick={handleGoBack}
                  h="full"
                  color="gray.600"
                  cursor="pointer"
                  variant="link"
                >
                  Voltar à listagem
                </Button>

                <Divider h="1rem" mx="2" orientation="vertical" />
                {product && (
                  <Breadcrumb
                    spacing="8px"
                    separator={<IoChevronForwardSharp color="gray.500" />}
                  >
                    <BreadcrumbItem>
                      <Link
                        href={`/produtos?generoCodigo=${product?.genero?.descricao}|${product?.genero?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.genero?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/produtos?grupoCodigo=${product?.grupo?.descricao}|${product?.grupo?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.grupo?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/produtos?linhaCodigo=${product?.linha?.descricao}|${product?.linha?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.linha?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/produtos/${product?.codigo}?hrefBack=${hrefBack}`}
                      >
                        <BreadcrumbLink>{product?.descricao}</BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                  </Breadcrumb>
                )}
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
                  <ProductImageCarouse
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
                        Características do Produto
                      </Text>

                      <Text
                        mb="8"
                        fontSize="medium"
                        fontWeight="light"
                        color="gray.600"
                      >
                        {product?.obs || product?.descricaoComplementar}
                      </Text>

                      <Box
                        w={["100%", "100%", "100%", "60%"]}
                        mb="2rem"
                        textTransform="capitalize"
                      >
                        <Text as="h2" mb="2" fontSize="lg" fontWeight="light">
                          Características Gerais
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

                        <Table
                          size="sm"
                          variant="striped"
                          textTransform="capitalize"
                        >
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

                        <Table
                          size="sm"
                          variant="striped"
                          textTransform="capitalize"
                        >
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

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
    </>
  );
}
