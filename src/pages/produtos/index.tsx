import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Slide,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useInView } from "react-intersection-observer";
import { Accordion } from "../../components/Accordion";
import { FilterRangeAmount } from "../../components/FilterRangeAmount";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { HeaderToList } from "../../components/HeaderToList";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { LoadingInfiniteScroll } from "../../components/LoadingInfiniteScroll";
import { ModalFilter } from "../../components/ModalFilter";
import { ModalOrderBy } from "../../components/ModalOrderBy";
import { PanelLayout } from "../../components/PanelLayout";
import { Product } from "../../components/Product";
import { Search } from "../../components/Search";
import { useLoading } from "../../contexts/LoadingContext";
import { spaceImages } from "../../global/parameters";
import { productsOrderBy, useProducts } from "../../hooks/queries/useProducts";
import { useProductsFilters } from "../../hooks/queries/useProductsFilters";
import { useLocalStore } from "../../hooks/useLocalStore";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  queryParamsToFiltersNormalized,
  useQueryParamsFilterList,
} from "../../hooks/useQueryParamsFilterList";

export default function Produtos() {
  const { ref, inView } = useInView();
  const toast = useToast();
  const toastIdRef = useRef();
  const router = useRouter();
  const { setLoading } = useLoading();
  const asPathBackHref = router.asPath.replaceAll("&", "!");
  const { setQueryParams } = useQueryParams({ router });

  const { isOpen, onToggle } = useDisclosure();

  const {
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

  const {
    data: scrollPosition,
    onRemove: onRemoveScrollPosition,
    onSet: onSetScrollPosition,
  } = useLocalStore("@ScrollY-Products");

  const [search, setSearch] = useState<string>(() => {
    return router.query.search ? String(router.query.search) : "";
  });
  const [orderBy, setOrderBy] = useState<string>(() => {
    return router.query.orderby
      ? String(router.query.orderby)
      : "precoVenda.desc";
  });
  const [filters, setFilters] = useState<SelectedFilter[]>(() => {
    return queryParamsToFiltersNormalized(router.query);
  });
  const [groupProduct, setGroupProduct] = useState<
    undefined | string | "codigoAlternativo"
  >(() => {
    return router?.query?.distinct ? String(router.query.distinct) : "";
  });
  const [stockLocation, setStockLocation] = useState(false);
  const [isVisibleFilters, setIsVisibleFilters] = useState(true);

  useQueryParamsFilterList({
    router,
    filters,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({
      pagesize: 40,
      orderby: orderBy,
      filters: filters,
      distinct: groupProduct ? "codigoAlternativo" : undefined,
      search: search,
    });

  const { data: productsFilters, isLoading: isLoadingProductsFilters } =
    useProductsFilters({});

  function setPositionScroll() {
    onSetScrollPosition(window.scrollY.toString());
  }

  async function handleClickProduct() {
    setPositionScroll();
    setLoading(true);
  }

  useEffect(() => {
    if (isActivatedCatalog && !isOpen) {
      onToggle();
    }
    if (!isActivatedCatalog && isOpen) {
      onToggle();
    }
  }, [isActivatedCatalog]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    setQueryParams({ type: "set", data: { field: "orderby", value: orderBy } });
  }, [orderBy]);
  useEffect(() => {
    setQueryParams({ type: "set", data: { field: "search", value: search } });
  }, [search]);
  useEffect(() => {
    setQueryParams({
      type: "set",
      data: { field: "distinct", value: groupProduct },
    });
  }, [groupProduct]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  useEffect(() => {
    const scrollY = Number(scrollPosition);
    if (!isNaN(scrollY)) {
      window.scrollTo({ top: scrollY, behavior: "smooth" });
      onRemoveScrollPosition();
    }
  }, [scrollPosition]);

  return (
    <>
      <Head>
        <title>Produtos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        title="Produtos"
        contentHeight={2.5}
        content={
          <Flex
            w="full"
            justify="space-around"
            display={["flex", "flex", "flex", "none"]}
          >
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
                  bg="primary"
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
        Center={
          <Box width={"100%"} paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}>
            <Search
              size={"md"}
              handleChangeSearch={(search) => {
                setSearch(search);
              }}
              currentSearch={search}
              placeholder="Buscar na Alpar do Brasil por produtos"
            />
          </Box>
        }
      />

      <PanelLayout isLoading={isLoadingProductsFilters}>
        {isVisibleFilters && (
          <Flex
            w="18rem"
            mr="8"
            display={["none", "none", "none", "flex"]}
            flexDirection="column"
          >
            <Flex
              justify="space-between"
              bg="white"
              p="4"
              mb="2"
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
              <FilterSelectedList filters={filters} setFilters={setFilters} />

              {productsFilters?.filters.find((f) => f.name === "salePrices")
                ?.name && (
                <Accordion isOpen={false} title="Preço de venda" mb="2">
                  <FilterRangeAmount
                    onChangeRange={([min, max]) => {
                      const newFilters = [
                        {
                          name: "salePrices",
                          field: `PDV mínimo (${min.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })})`,
                          value: min,
                        },
                        {
                          name: "salePrices",
                          field: `PDV máximo (${max.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })})`,
                          value: max,
                        },
                      ];
                      const normalized = filters.filter(
                        (f) => f.name !== "salePrices"
                      );
                      setFilters([...normalized, ...newFilters]);
                    }}
                    defaultMin={
                      Number(
                        productsFilters?.filters.find(
                          (f) => f.name === "salePrices"
                        )?.data[0].value
                      ) ?? 0
                    }
                    defaultMax={
                      Number(
                        productsFilters?.filters.find(
                          (f) => f.name === "salePrices"
                        )?.data[1].value
                      ) ?? 0
                    }
                  />
                </Accordion>
              )}

              {productsFilters?.filters && (
                <ListFilter
                  filters={productsFilters.filters?.filter(
                    (f) => !["salePrices"].includes(f.name)
                  )}
                  selectedFilter={filters}
                  onChangeSelectedFilter={(a) => {
                    setFilters(a);
                  }}
                />
              )}
            </Box>
          </Flex>
        )}

        <Box w="full">
          <HeaderToList
            title="Produtos"
            isLoading={isLoading}
            orderBy={{
              onChange: setOrderBy,
              currentValue: orderBy,
              data: productsOrderBy,
            }}
          >
            {!isVisibleFilters && (
              <Button
                borderRadius={0}
                onClick={onOpenFilter}
                variant="outline"
                rounded="md"
                ml="4"
              >
                Filtros
                {filters.length > 0 && (
                  <Flex
                    borderRadius="full"
                    bg="primary"
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
            )}

            <Flex
              justify="center"
              align="center"
              flexDir="row"
              ml="auto"
              mr="4"
            >
              <Text as={"span"} fontSize="sm" fontWeight="normal">
                OCULTAR FILTROS
              </Text>
              <Switch
                ml="2"
                size="md"
                checked={!isVisibleFilters}
                onChange={(e) => setIsVisibleFilters(!e.target.checked)}
                colorScheme="gray"
              />
            </Flex>
          </HeaderToList>

          <LoadingInfiniteScroll isLoadingNextPage={isFetchingNextPage}>
            <SimpleGrid columns={[2, 2, 3, 4]} spacing="1" mb="1rem">
              {data?.pages.map((page) =>
                page?.products.map((product, i) =>
                  i === page?.products.length - 4 ? (
                    <Box key={product.codigo} ref={ref}>
                      <Product
                        isCatalog
                        hrefBack={asPathBackHref}
                        href={"produtos"}
                        product={{
                          cod: product.codigo,
                          name: product.descricao,
                          descriptionAdditional: product.descricaoAdicional,
                          reference: product.referencia,
                          amount: `PDV ${product.precoVendaFormat}`,
                          uri: `${spaceImages}/Produtos/${
                            product?.imagemPreview
                              ? product.imagemPreview
                              : product.referencia + "_01"
                          }_smaller`,
                        }}
                        onClickProduct={handleClickProduct}
                      />
                    </Box>
                  ) : (
                    <Box key={product.codigo}>
                      <Product
                        isCatalog
                        hrefBack={asPathBackHref}
                        href="produtos"
                        product={{
                          cod: product.codigo,
                          name: product.descricao,
                          descriptionAdditional: product.descricaoAdicional,
                          reference: product.referencia,
                          amount: `PDV ${product.precoVendaFormat}`,
                          uri: `${spaceImages}/Produtos/${
                            product?.imagemPreview
                              ? product.imagemPreview
                              : product.referencia + "_01"
                          }_smaller`,
                        }}
                        onClickProduct={handleClickProduct}
                      />
                    </Box>
                  )
                )
              )}
            </SimpleGrid>
          </LoadingInfiniteScroll>
        </Box>
      </PanelLayout>

      <ModalFilter
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        dataFilters={
          productsFilters?.filters?.filter(
            (f) => !["salePrices"].includes(f.name)
          ) ?? []
        }
        filters={filters}
        setFilters={setFilters}
      >
        <>
          <Flex
            justify="space-between"
            bg="white"
            p="4"
            mb="2"
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

          {productsFilters?.filters.find((f) => f.name === "salePrices")
            ?.name && (
            <Accordion isOpen={false} title="Preço de venda" mb="2">
              <FilterRangeAmount
                onChangeRange={([min, max]) => {
                  const newFilters = [
                    {
                      name: "salePrices",
                      field: `PDV mínimo (${min.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })})`,
                      value: min,
                    },
                    {
                      name: "salePrices",
                      field: `PDV máximo (${max.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })})`,
                      value: max,
                    },
                  ];
                  const normalized = filters.filter(
                    (f) => f.name !== "salePrices"
                  );
                  setFilters([...normalized, ...newFilters]);
                }}
                defaultMin={
                  Number(
                    productsFilters?.filters.find(
                      (f) => f.name === "salePrices"
                    )?.data[0].value
                  ) ?? 0
                }
                defaultMax={
                  Number(
                    productsFilters?.filters.find(
                      (f) => f.name === "salePrices"
                    )?.data[1].value
                  ) ?? 0
                }
              />
            </Accordion>
          )}
        </>
      </ModalFilter>

      <ModalOrderBy
        isOpen={isOpenOrderBy}
        onClose={onCloseOrderBy}
        orderByItems={productsOrderBy}
        currentOrderByValue={orderBy}
        setOrderBy={(orderByValue) => {
          setOrderBy(String(orderByValue));
          onCloseOrderBy();
        }}
      />

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
                >{`${productsSelectedCatalog.length} produtos selecionados`}</Text>
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
                >{`${productsSelectedCatalog.length} produtos selecionados`}</Text>

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
                        groupProduct: groupProduct === "codigoAlternativo",
                        stockLocation: stockLocation,
                        filters: JSON.stringify(
                          filters.filter((f) =>
                            [
                              "linhaCodigo",
                              "colecaoCodigo",
                              "grupoCodigo",
                              "locaisEstoque",
                              "concept",
                            ].includes(f.name)
                          )
                        ),
                      })
                    }
                  >
                    GERAR
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
