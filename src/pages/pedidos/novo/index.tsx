import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";
import { useInView } from "react-intersection-observer";
import { Me } from "../../../@types/me";
import { DrawerList } from "../../../components/DrawerList";
import { FilterSelectedList } from "../../../components/FilterSelectedList";
import { HeaderNavigation } from "../../../components/HeaderNavigation";
import { HeaderToList } from "../../../components/HeaderToList";
import { ListFilter, SelectedFilter } from "../../../components/ListFilter";
import { LoadingInfiniteScroll } from "../../../components/LoadingInfiniteScroll";
import { ModalFilter } from "../../../components/ModalFilter";
import { ModalOrderBy } from "../../../components/ModalOrderBy";
import { PanelLayout } from "../../../components/PanelLayout";
import { Product } from "../../../components/Product";
import { ProductStore } from "../../../components/ProductStore";
import { Search } from "../../../components/Search";
import { ShoppingButton } from "../../../components/ShoppingButton";
import { useLoading } from "../../../contexts/LoadingContext";
import { useStore } from "../../../contexts/StoreContext";
import { spaceImages } from "../../../global/parameters";
import {
  productsOrderBy,
  useProducts,
} from "../../../hooks/queries/useProducts";
import { useProductsFilters } from "../../../hooks/queries/useProductsFilters";
import { useQueryParams } from "../../../hooks/useQueryParams";
import {
  queryParamsToFiltersNormalized,
  useQueryParamsFilterList,
} from "../../../hooks/useQueryParamsFilterList";
import { setupAPIClient } from "../../../service/api";
import { withSSRAuth } from "../../../utils/withSSRAuth";

interface OrderProps {
  me: Me;
}

export default function Order({ me }: OrderProps) {
  const { ref, inView } = useInView();
  const { setLoading } = useLoading();
  const router = useRouter();
  const { setQueryParams } = useQueryParams({ router });
  const { client, priceList, orders, reset, totalItems, exitOrder } =
    useStore();

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
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

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
    return router.query.distinct ? String(router.query.distinct) : "";
  });

  useQueryParamsFilterList({
    router,
    filters,
  });

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
      pagesize: 40,
      orderby: orderBy,
      filters: [
        ...filters,
        { value: client?.codigo ?? 0, name: "clientCod", field: "clientCod" },
        {
          value: priceList?.codigo ?? 0,
          name: "priceListCod",
          field: "priceListCod",
        },
      ],
      distinct: groupProduct ? "codigoAlternativo" : undefined,
      search: search,
    });
  const { data: productsFilters, isLoading: isLoadingProductsFilters } =
    useProductsFilters({
      filters: [
        {
          value: client?.codigo ?? 0,
          name: "clientCod",
          field: "clientCod",
        },
        {
          value: priceList?.codigo ?? 0,
          name: "priceListCod",
          field: "priceListCod",
        },
      ],
    });

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

  return (
    <>
      <Head>
        <title>Pedido | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me?.email }}
        title="Pedido"
        Right={<ShoppingButton qtdItens={totalItems} onClick={onOpenOrder} />}
        Left={
          <Button
            p="0"
            bg="transparent"
            display="flex"
            _hover={{ bg: "transparent" }}
            alignItems="center"
            justifyContent="center"
            onClick={exitOrder}
            ml="4"
          >
            <ImExit color="white" fontSize={"1.8rem"} />
            <Text color="white" ml="2">
              Sair
            </Text>
          </Button>
        }
        contentHeight={4}
        content={
          <Flex w="full" flexDir="column">
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

            <Flex
              w="full"
              h="1.5rem"
              bg="gray.50"
              align="center"
              justify="space-between"
              px="2rem"
              // _hover={{
              //   filter: "brightness(0.95)",
              //   cursor: "pointer",
              // }}
            >
              <Text fontWeight="light" fontSize="sm">
                {!!client?.codigo
                  ? `${client?.codigo} - ${client?.razaoSocial}`
                  : "-"}
              </Text>

              <Text fontWeight="light" fontSize="sm">
                {!!priceList?.codigo ? `${priceList?.descricao}` : "-"}
              </Text>
            </Flex>
          </Flex>
        }
      />

      <PanelLayout
        isLoading={isLoadingProductsFilters}
        pt={["8rem", "8rem", "8rem", "7rem"]}
      >
        <Flex
          w="22rem"
          mr="3rem"
          display={["none", "none", "none", "flex"]}
          flexDirection="column"
        >
          <Search mb="4" setSearch={setSearch} search={search} />

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
            <FilterSelectedList filters={filters} setFilters={setFilters} />

            {productsFilters?.filters && (
              <ListFilter
                filters={productsFilters?.filters}
                selectedFilter={filters}
                onChangeSelectedFilter={(a) => {
                  setFilters(a);
                }}
                isOpen
              />
            )}
          </Box>
        </Flex>

        <Box w="full">
          <HeaderToList
            title="Produtos"
            isLoading={isLoading}
            orderBy={{
              onChange: setOrderBy,
              currentValue: orderBy,
              data: productsOrderBy,
            }}
          />

          <LoadingInfiniteScroll isLoadingNextPage={isFetchingNextPage}>
            <SimpleGrid columns={[2, 2, 3, 4]} spacing="1" mb="1rem">
              {data?.pages.map((page) =>
                page?.products.map((product, i) =>
                  i === page?.products.length - 4 ? (
                    <Box key={product.codigo} ref={ref}>
                      <Product
                        href="pedidos/novo/produtos"
                        product={{
                          cod: product.codigo,
                          name: product.descricao,
                          descriptionAdditional: product.descricaoAdicional,
                          reference: product.referencia,
                          amount:
                            product.listaPreco?.find(
                              (f) =>
                                Number(f.codigo) === Number(priceList?.codigo)
                            )?.valorFormat ?? "-",
                          pdv: product.precoVendaFormat ?? "-",
                          uri: `${spaceImages}/Produtos/${product.referencia}_01`,
                        }}
                      />
                    </Box>
                  ) : (
                    <Product
                      href="pedidos/novo/produtos"
                      key={product.codigo}
                      product={{
                        cod: product.codigo,
                        name: product.descricao,
                        descriptionAdditional: product.descricaoAdicional,
                        reference: product.referencia,
                        amount:
                          product.listaPreco?.find(
                            (f) =>
                              Number(f.codigo) === Number(priceList?.codigo)
                          )?.valorFormat ?? "-",
                        pdv: product.precoVendaFormat ?? "-",
                        uri: `${spaceImages}/Produtos/${
                          product.imagens && product.imagens[0]
                            ? product.imagens[0].nome
                            : product.referencia + "_01"
                        }`,
                      }}
                    />
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
        dataFilters={productsFilters?.filters ?? []}
        filters={filters}
        setFilters={setFilters}
      >
        <>
          <Search mb="4" setSearch={setSearch} search={search} />

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
        </>
      </ModalFilter>

      <ModalOrderBy
        isOpen={isOpenOrderBy}
        onClose={onCloseOrderBy}
        OrderByItems={productsOrderBy}
        currentOrderByValue={orderBy}
        setOrderBy={(orderByValue) => {
          setOrderBy(String(orderByValue));
          onCloseOrderBy();
        }}
      />

      <DrawerList
        title={`Carrinho (${totalItems})`}
        isOpen={isOpenOrder}
        onClose={onCloseOrder}
      >
        <Accordion mt="2rem" px="1rem" allowMultiple>
          {orders.map((order) => (
            <AccordionItem
              key={order.stockLocation.periodo}
              border={0}
              bg="white"
              mb="1rem"
              borderRadius="md"
            >
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="2xl" fontWeight="bold">
                    {`${order.stockLocation.descricao} (${order.items.length})`}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel borderTop="1px" borderColor="gray.100">
                {order.items.map((item) => (
                  <Box
                    key={item.product.codigo}
                    borderBottom="1px"
                    borderColor="gray.100"
                    pb="2"
                  >
                    <ProductStore
                      product={{
                        cod: item.product.codigo,
                        name: item.product.descricao,
                        reference: item.product.referencia,
                        packingQuantity: item.product.qtdEmbalagem,
                        stockLocationsQtd:
                          item.product?.locaisEstoque?.find(
                            (f) =>
                              String(f.periodo) ===
                              String(order.stockLocation.periodo)
                          )?.quantidade ?? 0,
                        uri: `${spaceImages}/Produtos/${
                          item.product.imagens && item.product.imagens[0]
                            ? item.product.imagens[0].nome
                            : item.product.referencia + "_01"
                        }`,
                      }}
                      amount={item.amountFormat}
                      qtd={item.qtd}
                    />
                  </Box>
                ))}
                <Text
                  mt="4"
                  textAlign="end"
                  fontSize="larger"
                  fontWeight="bold"
                >
                  TOTAL {order.amountFormat}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </DrawerList>
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
