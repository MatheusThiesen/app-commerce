import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
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
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { IoChevronForwardSharp } from "react-icons/io5";
import { TbShoppingCartCancel } from "react-icons/tb";
import { Me } from "../../../../@types/me";
import { Cart } from "../../../../components/Cart";
import { InputQuantity } from "../../../../components/Form/InputQuantity";
import { HeaderNavigation } from "../../../../components/HeaderNavigation";
import { ModalAlert } from "../../../../components/ModalAlert";
import { ModalSelectPriceList } from "../../../../components/ModalSelectPriceList";
import { ProductImageCarouse } from "../../../../components/ProductImageCarouse";
import { ShoppingButton } from "../../../../components/ShoppingButton";
import { VariationsProduct } from "../../../../components/VariationsProduct";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useStore } from "../../../../contexts/StoreContext";
import { spaceImages } from "../../../../global/parameters";
import {
  StockLocation,
  useProductOne,
} from "../../../../hooks/queries/useProducts";
import { useImagesProduct } from "../../../../hooks/useImagesProduct";
import { setupAPIClient } from "../../../../service/api";

export default function Produto() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const toast = useToast();

  const { totalItems, orders, client, changePriceList, exitOrder } = useStore();

  const {
    isOpen: isConfirmExitOrder,
    onOpen: onOpenConfirmExitOrder,
    onClose: onCloseConfirmExitOrder,
  } = useDisclosure();

  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();
  const {
    isOpen: isOpenSeleteListPrice,
    onOpen: onOpenSeleteListPrice,
    onClose: onCloseSeleteListPrice,
  } = useDisclosure();

  const { codigo, hrefBack } = router.query;
  const [images, setImages] = useState<string[]>([]);
  const [stockLocationSelected, setStockLocationSelected] = useState<
    StockLocation | undefined
  >();

  const {
    data: product,
    isLoading,
    refetch,
  } = useProductOne(Number(codigo), client?.codigo);

  const { priceList, addItem } = useStore();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    (async () => {
      if (product) {
        const getImages = await useImagesProduct({
          reference: product.referencia,
          images: product.imagens?.map((item) => item.nome),
        });

        setImages(getImages ?? [""]);
        setLoading(false);
        setStockLocationSelected(undefined);
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

  function handleGoBack() {
    const hrefBack = router.query?.hrefBack;

    if (hrefBack && hrefBack !== "undefined") {
      router.push(String(hrefBack).replaceAll("!", "&"));
    } else {
      router.back();
    }
  }

  const InfoProduct = () => {
    return (
      <>
        <Text as="p" color="gray.600" fontSize="md" fontWeight="md" mt="2">
          {`${priceList?.descricao} ${
            product?.listaPreco?.find(
              (f) => Number(f.codigo) === Number(priceList?.codigo)
            )?.valorFormat ?? "-"
          }`}
        </Text>
        <Text as="span" fontSize="3xl" fontWeight="medium">
          PDV {product?.precoVendaFormat ?? "-"}
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
          <Box>
            <Text fontWeight="light">Grade</Text>
            <Select
              onChange={(e) => {
                if (Number(e?.target.value) !== product?.codigo) {
                  setLoading(true);
                  router.push(
                    `/pedidos/novo/produtos/${e?.target.value}?hrefBack=${hrefBack}`
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
        </Stack>

        <Button
          colorScheme="blue"
          mt="6"
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
        onGoBack={handleGoBack}
        title="Detalhes"
        Right={
          <Stack direction="row" pr="2">
            <Button
              p="0"
              bg="transparent"
              display="flex"
              _hover={{ bg: "transparent" }}
              alignItems="center"
              justifyContent="center"
              onClick={onOpenConfirmExitOrder}
              ml={["2", "2", "2", "0"]}
              mr={["0", "0", "0", "1rem "]}
            >
              <ImExit color="white" fontSize={"1.8rem"} />
              <Text
                color="white"
                ml="1"
                display={["none", "none", "flex", "flex"]}
              >
                Sair
              </Text>
            </Button>

            <ShoppingButton qtdItens={totalItems} onClick={onOpenOrder} />
          </Stack>
        }
        isNotNavigation
        contentHeight={2}
        content={
          <Center w="full" h="1.5rem" bg="gray.50">
            <Flex
              w="full"
              maxW="1200px"
              align="center"
              justify="space-between"
              px="2rem"
            >
              <Box width="50%">
                <Text
                  fontWeight="light"
                  fontSize={["sm", "sm", "sm", "md"]}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {!!client?.codigo
                    ? `${client?.codigo} - ${client?.razaoSocial}`
                    : "-"}
                </Text>
              </Box>

              <Box width="50%" borderLeft="1px solid #ccc">
                <Text
                  fontWeight="light"
                  fontSize={["sm", "sm", "sm", "md"]}
                  onClick={onOpenSeleteListPrice}
                  textAlign="center"
                  cursor="pointer"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  _hover={{
                    fontWeight: "bold",
                  }}
                >
                  {!!priceList?.codigo ? `${priceList?.descricao}` : "-"}
                </Text>
              </Box>
            </Flex>
          </Center>
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
                  Voltar
                </Button>

                <Divider h="1rem" mx="2" orientation="vertical" />

                {product && (
                  <Breadcrumb
                    spacing="8px"
                    separator={<IoChevronForwardSharp color="gray.500" />}
                  >
                    <BreadcrumbItem>
                      <Link
                        href={`/pedidos/novo?generoCodigo=${product?.genero?.descricao}|${product?.genero?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.genero?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/pedidos/novo?grupoCodigo=${product?.grupo?.descricao}|${product?.grupo?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.grupo?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/pedidos/novo?linhaCodigo=${product?.linha?.descricao}|${product?.linha?.codigo}`}
                      >
                        <BreadcrumbLink>
                          {product?.linha?.descricao}
                        </BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link
                        href={`/pedidos/novo/${product?.codigo}?hrefBack=${hrefBack}`}
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
                  {images.length <= 0 ? (
                    <Flex h="26rem" w="full" justify="center" align="center">
                      <Spinner ml={["0", "0", "0", "4"]} size="xl" />
                    </Flex>
                  ) : (
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

                      <Box w={["100%", "100%", "100%", "60%"]} mb="2rem">
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

      <ModalAlert
        isOpen={isConfirmExitOrder}
        onClose={onCloseConfirmExitOrder}
        data={{
          Icon: TbShoppingCartCancel,
          title:
            "Tem certeza que deseja sair? Ao sair seus itens no carrinho serão perdidos.",
        }}
        confirmOptions={{
          onConfirm: exitOrder,
          onClose: onCloseConfirmExitOrder,
          titleButtonConfirm: "Sim, sair do pedido!",
          titleButtonClose: "Cancelar",
        }}
      />

      <ModalSelectPriceList
        isOpen={isOpenSeleteListPrice}
        onClose={onCloseSeleteListPrice}
        setPriceList={(data) => {
          changePriceList(data);
          refetch();
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get<Me>("/auth/me");

  if (response.data.eVendedor === false)
    return {
      redirect: {
        destination: "/inicio",
        permanent: true,
      },
    };

  return {
    props: {},
  };
};
