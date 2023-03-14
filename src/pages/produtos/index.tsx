import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Slide,
  Spinner,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { IoBook } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import { Me } from "../../@types/me";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ModalList } from "../../components/ModalList";
import { OrderBy } from "../../components/OrderBy";
import { OrderByMobile } from "../../components/OrderByMobile";
import { Pagination } from "../../components/Pagination";
import { Product } from "../../components/Product";
import {
  ProductListFilter,
  SelectedFilter,
} from "../../components/ProductListFilter";
import {
  FilterList,
  getProducts,
  useProducts,
} from "../../hooks/queries/useProducts";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";
import { exportXlsx } from "../../utils/exportXlsx";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface ProductsProps {
  me: Me;
}

const OrderByItems = [
  {
    name: "Maior Preços",
    value: "precoVenda.desc",
  },
  {
    name: "Menor Preços",
    value: "precoVenda.asc",
  },
  {
    name: "Alfabética A>Z",
    value: "descricao.asc",
  },
  {
    name: "Alfabética Z>A",
    value: "descricao.desc",
  },
];

const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";

export default function Produtos({ me }: ProductsProps) {
  const toast = useToast();
  const toastIdRef = useRef();

  const {
    onChangeActivated: onChangeActivatedProductCatalog,
    isActivated: isActivatedCatalog,
    productsSelected: productsSelectedCatalog,
    onRemoveAllProduct: onRemoveAllProductCatalog,
    onSelectedAllProduct: onSelectedAllProductCatalog,
    onGenerateCatalog,
  } = useProductCatalog();

  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();
  const {
    isOpen: isOpenOrderBy,
    onOpen: onOpenOrderBy,
    onClose: onCloseOrderBy,
  } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [groupProduct, setGroupProduct] = useState<
    undefined | "codigoAlternativo"
  >();
  const [stockLocation, setStockLocation] = useState(false);
  const [dataFilters, setDataFilters] = useState<FilterList[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(true);
  const [page, setPage] = useState(() => {
    return 1;
  });
  const [orderBy, setOrderBy] = useState<string>(() => {
    return "precoVenda.desc";
  });

  const { data, isLoading } = useProducts({
    page,
    pagesize: 40,
    orderby: orderBy,
    filters: filters,
    distinct: groupProduct ? "codigoAlternativo" : undefined,
  });

  useEffect(() => {
    (async () => {
      const { data } = await api.get<FilterList[]>("/products/filters");
      setDataFilters(data);

      setIsLoadingFilters(false);
    })();
  }, []);

  useEffect(() => {
    if (isActivatedCatalog && !isOpen) {
      onToggle();
    }
    if (!isActivatedCatalog && isOpen) {
      onToggle();
    }
  }, [isActivatedCatalog]);

  async function handleExportList() {
    //@ts-ignore
    toastIdRef.current = toast({
      position: "top-right",
      duration: 100000,
      render: () => (
        <Box
          bg="blue.400"
          p="3"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" justifyContent="start">
            <Icon as={IoBook} color="white" mr="3" fontSize="20px" />
            <Text as="span" color="white" fontSize="md">
              Gerando relatório
            </Text>
          </Box>
          <Spinner ml="3" size="md" color="white" />
        </Box>
      ),
    });

    try {
      const responseProducts = await getProducts({
        page: 1,
        filters: filters,
        orderby: orderBy,
        pagesize: 100000,
        isReport: true,
      });

      const normalizedProducts = responseProducts.products.map((product) => {
        let data = {};

        if (product.locaisEstoque) {
          for (let index = 0; index < product.locaisEstoque?.length; index++) {
            data = {
              [product.locaisEstoque[0].descricao]:
                product.locaisEstoque[0].quantidade,
            };
          }
        }

        return {
          "Cód. Produto": product.codigo ?? "-",
          "Cód. Agrupador": product.codigoAlternativo ?? "-",
          Referência: product.referencia ?? "-",
          Descrição: product.descricao ?? "-",
          PDV: product.precoVenda ?? "-",
          Grade: product.descricaoAdicional ?? "-",
          Marca: product.marca.descricao ?? "-",
          Coleção: product.colecao?.descricao ?? "-",
          Linha: product.linha?.descricao ?? "-",
          Grupo: product.grupo?.descricao ?? "-",
          Subgrupo: product.subGrupo?.descricao ?? "-",
          Gênero: product.genero?.descricao ?? "-",
          ...data,
        };
      });

      const now = new Date().toLocaleString("pt-br", {
        dateStyle: "short",
      });

      await exportXlsx({
        filename: `Produtos-${now}`,
        data: normalizedProducts,
      });

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "relatório gerado!",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "Ocorreu um erro ao gerar Catálogo.",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  }

  return (
    <>
      <Head>
        <title>Produtos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me.email }}
        title="Produtos"
        Right={
          <Button
            colorScheme="none"
            display="flex"
            alignItems="center"
            onClick={() =>
              onChangeActivatedProductCatalog((oldDate) => !oldDate)
            }
          >
            <IoBook fontSize={"20"} color="white" />
          </Button>
        }
        contentHeight={2.5}
        content={
          <Flex w="full" justify="space-around">
            <Button
              bg="white"
              borderRadius={0}
              w="full"
              onClick={onOpenOrderBy}
            >
              Ordenação
            </Button>
            <Button
              bg="white"
              borderRadius={0}
              borderLeft="1px solid #ccc"
              w="full"
              onClick={onOpenFilter}
            >
              Filtros
              {filters.length > 0 && (
                <Flex
                  borderRadius="full"
                  bg="red.500"
                  ml="1.5"
                  h="1.6rem"
                  w="1.6rem"
                  align="center"
                  justify="center"
                >
                  <Text fontSize="smaller" color="white">
                    {filters.length}
                  </Text>
                </Flex>
              )}
            </Button>
          </Flex>
        }
      />

      {isLoadingFilters ? (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      ) : (
        <>
          <Flex
            pt={["6.5rem", "6.5rem", "6.5rem", "7rem"]}
            pb={["7rem"]}
            justify="center"
            w="full"
          >
            <Flex w="full" maxW="1200px">
              <Flex
                w="22rem"
                mr="3rem"
                display={["none", "none", "none", "flex"]}
                flexDirection="column"
              >
                <Flex
                  justify="space-between"
                  bg="white"
                  p="4"
                  mb="4"
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Agrupar produtos</Text>
                  <Switch
                    isChecked={!!groupProduct}
                    onChange={(e) =>
                      setGroupProduct(
                        e.target.checked ? "codigoAlternativo" : undefined
                      )
                    }
                    size="lg"
                    colorScheme="red"
                  />
                </Flex>

                <Box borderRadius="md">
                  <FilterSelectedList
                    filters={filters}
                    setFilters={setFilters}
                  />

                  {dataFilters && (
                    <ProductListFilter
                      filters={dataFilters}
                      selectedFilter={filters}
                      onChangeSelectedFilter={(a) => {
                        setPage(1);

                        setFilters(a);
                      }}
                      isOpen
                    />
                  )}
                </Box>
              </Flex>

              <Box w="full">
                <Flex display={["none", "none", "none", "block"]}>
                  <Text
                    as="h1"
                    fontSize="4xl"
                    fontWeight="bold"
                    color="gray.700"
                    lineHeight="2rem"
                  >
                    Produtos
                    {isLoading && <Spinner ml="4" size="md" />}
                    <Button type="button" ml="2" onClick={handleExportList}>
                      <Icon
                        as={SiMicrosoftexcel}
                        fontSize="1.5rem"
                        color="#147b45"
                        ml="-1"
                      />
                    </Button>
                  </Text>

                  <Flex justifyContent="space-between" mt="1" mb="2">
                    <Text fontSize="md" color="gray.600">
                      Exibindo: {data?.productsStartShow} -{" "}
                      {data?.productsEndShow} de {data?.total} resultados
                    </Text>

                    <OrderBy
                      onChange={setOrderBy}
                      currentValue={orderBy}
                      data={OrderByItems}
                    />
                  </Flex>
                </Flex>

                <SimpleGrid columns={[2, 2, 3, 4]} spacing="1" mb="1rem">
                  {data?.products.map((product) => (
                    <Product
                      key={product.codigo}
                      product={{
                        cod: product.codigo,
                        name: product.descricao,
                        descriptionAdditional: product.descricaoAdicional,
                        reference: product.referencia,
                        priceSale: product.precoVendaFormat,
                        uri: `${spaceImages}/Produtos/${product.referencia}_01`,
                      }}
                    />
                  ))}
                </SimpleGrid>

                <Pagination
                  currentPage={(data?.page ?? 0) + 1}
                  pageSize={data?.pagesize}
                  onPageChange={setPage}
                  totalRegisters={data?.total ?? 0}
                />
              </Box>
            </Flex>
          </Flex>

          <ModalList
            title="Filtros"
            isOpen={isOpenFilter}
            onClose={onCloseFilter}
          >
            <Box borderRadius="md">
              <FilterSelectedList filters={filters} setFilters={setFilters} />

              <Box p="6">
                {dataFilters && (
                  <ProductListFilter
                    filters={dataFilters}
                    selectedFilter={filters}
                    onChangeSelectedFilter={(a) => {
                      setPage(1);
                      setFilters(a);
                    }}
                  />
                )}
              </Box>
            </Box>
          </ModalList>

          <ModalList
            title="Ordenar por"
            isOpen={isOpenOrderBy}
            onClose={onCloseOrderBy}
          >
            <OrderByMobile
              OrderByItems={OrderByItems}
              currentOrderByValue={orderBy}
              setOrderBy={(orderByValue) => {
                setOrderBy(orderByValue);
                onCloseOrderBy();
              }}
            />
          </ModalList>
        </>
      )}

      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
        <Box p={["100px", "100px", "100px", "50px"]}>
          <Flex
            bg="white"
            position="fixed"
            bottom={["3.5rem", "3.5rem", "3.5rem", 0]}
            left="0"
            w="full"
            justify={"center"}
            boxShadow="dark-lg"
          >
            <Flex
              maxW="900px"
              w="full"
              px={["4", "4", "4", "8"]}
              py={["4", "4", "4", "6"]}
              justify="space-between"
            >
              <Box>
                <Text fontSize={["lg", "lg", "lg", "3xl"]} fontWeight="bold">
                  CATÁLOGO
                </Text>

                <Text
                  display={["block", "block", "block", "none"]}
                  color="gray.500"
                >{`${productsSelectedCatalog.length}/500 produtos selecionados`}</Text>
              </Box>

              <Flex justify="center" align="center" columnGap="2">
                <Text fontWeight="light" fontSize="md">
                  Mostrar estoque
                </Text>
                <Switch
                  isChecked={!!stockLocation}
                  onChange={(e) => setStockLocation(e.target.checked)}
                  size="sm"
                  colorScheme="red"
                />
              </Flex>

              <Stack>
                <Text
                  display={["none", "none", "none", "block"]}
                  color="gray.500"
                >{`${productsSelectedCatalog.length}/500 produtos selecionados`}</Text>

                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <Button
                    type="button"
                    size={"sm"}
                    variant="link"
                    color="gray.800"
                    onClick={() =>
                      onGenerateCatalog({
                        orderBy: orderBy,
                        groupProduct: groupProduct !== undefined,
                        stockLocation: stockLocation,
                      })
                    }
                  >
                    IMPRIMIR
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    color="gray.800"
                    onClick={() =>
                      onSelectedAllProductCatalog(
                        filters,
                        orderBy,
                        groupProduct === "codigoAlternativo"
                      )
                    }
                  >
                    MARCAR TODOS
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    color="gray.800"
                    onClick={onRemoveAllProductCatalog}
                  >
                    DESMARCAR TODOS
                  </Button>
                </Stack>
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </Slide>
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
