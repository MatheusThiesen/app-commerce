import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { Me } from "../../@types/me";

import { setupAPIClient } from "../../service/api";

import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";

import { useOrders } from "../../hooks/queries/useOrder";
import { useOrdersFilters } from "../../hooks/queries/useOrdersFilters";

import { GetServerSideProps } from "next";
import { Alert } from "../../components/Alert";
import { Cart } from "../../components/Cart";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { LoadingInfiniteScroll } from "../../components/LoadingInfiniteScroll";
import { ModalList } from "../../components/ModalList";
import { ModalSelectClient } from "../../components/ModalSelectClient";
import { Order } from "../../components/Order";
import { OrderBy } from "../../components/OrderBy";
import { OrderByMobile } from "../../components/OrderByMobile";
import { PanelLayout } from "../../components/PanelLayout";
import { Search } from "../../components/Search";
import { ShoppingButton } from "../../components/ShoppingButton";
import { useAuth } from "../../contexts/AuthContext";

const OrderByItems = [
  {
    name: "Digitação decrescente",
    value: "createdAt.desc",
  },
  {
    name: "Digitação crescente",
    value: "createdAt.asc",
  },
];

export default function Orders() {
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
    isOpen: isOpenSeleteClient,
    onOpen: onOpenSeleteClient,
    onClose: onCloseSeleteClient,
  } = useDisclosure();
  const {
    isOpen: isOpenAlertBilletClient,
    onOpen: onOpenAlertBilletClient,
    onClose: onCloseAlertBilletClient,
  } = useDisclosure();

  const { ref, inView } = useInView();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [orderBy, setOrderBy] = useState<string>(() => {
    return "createdAt.desc";
  });
  const { setLoading } = useLoading();
  const { user } = useAuth();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOrders({
      pagesize: 10,
      orderby: orderBy,
      filters: filters,
      search: search,
    });

  const { data: dataFilters, isLoading: isLoadingFilters } = useOrdersFilters(
    {}
  );

  const { createOrder, totalItems } = useStore();
  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Pedidos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        title="Pedidos"
        Right={
          user.eCliente ? (
            <ShoppingButton
              qtdItens={totalItems}
              onClick={onOpenOrder}
              disabledTitle
            />
          ) : (
            <Button
              onClick={onOpenSeleteClient}
              variant="unstyled"
              display={["flex", "flex", "flex", "none"]}
              justifyContent="center"
              alignItems="center"
            >
              <IoMdAddCircle color="white" fontSize={"1.8rem"} />
            </Button>
          )
        }
        contentHeight={2.5}
        Center={
          <Box width={"100%"} paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}>
            <Search
              size="md"
              currentSearch={search}
              handleChangeSearch={(s) => setSearch(s)}
              placeholder="Buscar na Alpar do Brasil por pedidos"
            />
          </Box>
        }
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
      />

      <PanelLayout isLoading={isLoadingFilters}>
        <Flex w="full" maxW="1200px">
          <Flex
            w="18rem"
            mr="8"
            display={["none", "none", "none", "flex"]}
            flexDirection="column"
          >
            <Box borderRadius="md">
              <FilterSelectedList filters={filters} setFilters={setFilters} />

              {dataFilters && (
                <ListFilter
                  filters={dataFilters.filters.filter(
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

          <Box w="full">
            <Flex display={["none", "none", "none", "block"]}>
              <Text
                as="h1"
                fontSize="4xl"
                fontWeight="bold"
                color="gray.700"
                lineHeight="2rem"
              >
                Pedidos
                {isLoading && <Spinner ml="4" size="md" />}
                {user.eVendedor && (
                  <Button type="button" ml="2" onClick={onOpenSeleteClient}>
                    <Icon
                      as={IoMdAddCircle}
                      color="primary"
                      fontSize={"1.8rem"}
                    />
                  </Button>
                )}
              </Text>

              <Flex justifyContent="space-between" mt="1" mb="2">
                <Text fontSize="md" color="gray.600">
                  Total {data?.pages[data?.pages.length - 1].total} resultados
                </Text>

                <OrderBy
                  onChange={setOrderBy}
                  currentValue={orderBy}
                  data={OrderByItems}
                />
              </Flex>
            </Flex>

            <LoadingInfiniteScroll isLoadingNextPage={isFetchingNextPage}>
              <>
                <Stack mb="1rem">
                  {data?.pages.map((page) =>
                    page?.orders.map((order, i) =>
                      i === page?.orders?.length - 3 ? (
                        <Link
                          key={order.codigo}
                          href={`/pedidos/${order.codigo}`}
                          passHref
                        >
                          <ChakraLink
                            ref={ref}
                            _hover={{
                              filter: "brightness(0.95)",
                              cursor: "pointer",
                            }}
                          >
                            <Order
                              code={order.codigoErp}
                              client={`${order.cliente.razaoSocial} - ${order.cliente.cnpjFormat}`}
                              date={order.createdAtFormat}
                              paymentCondition={
                                order.condicaoPagamento.descricao
                              }
                              totalValue={order.valorTotalFormat}
                              status={
                                order.situacaoPedido && {
                                  code: order.situacaoPedido?.codigo,
                                  description: order.situacaoPedido?.descricao,
                                }
                              }
                              eRascunho={order.eRascunho}
                              seller={
                                order.vendedores.find((f) => f.tipo === 1)
                                  ?.vendedor
                              }
                            />
                          </ChakraLink>
                        </Link>
                      ) : (
                        <Link
                          key={order.codigo}
                          href={`/pedidos/${order.codigo}`}
                          passHref
                        >
                          <ChakraLink
                            _hover={{
                              filter: "brightness(0.95)",
                              cursor: "pointer",
                            }}
                          >
                            <Order
                              code={order.codigoErp}
                              client={`${order.cliente.razaoSocial} - ${order.cliente.cnpjFormat}`}
                              date={order.createdAtFormat}
                              paymentCondition={
                                order.condicaoPagamento.descricao
                              }
                              totalValue={order.valorTotalFormat}
                              eRascunho={order.eRascunho}
                              status={
                                order.situacaoPedido && {
                                  code: order.situacaoPedido?.codigo,
                                  description: order.situacaoPedido?.descricao,
                                }
                              }
                              seller={
                                order.vendedores.find((f) => f.tipo === 1)
                                  ?.vendedor
                              }
                            />
                          </ChakraLink>
                        </Link>
                      )
                    )
                  )}
                </Stack>
              </>
            </LoadingInfiniteScroll>
          </Box>
        </Flex>
      </PanelLayout>

      <ModalList title="Filtros" isOpen={isOpenFilter} onClose={onCloseFilter}>
        <Box borderRadius="md">
          <FilterSelectedList filters={filters} setFilters={setFilters} />

          <Box p="6">
            {dataFilters && (
              <ListFilter
                filters={dataFilters.filters.filter(
                  (f) => !["salePrices"].includes(f.name)
                )}
                selectedFilter={filters}
                onChangeSelectedFilter={(a) => {
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
        placement="left"
      >
        <OrderByMobile
          orderByItems={OrderByItems}
          currentOrderByValue={orderBy}
          setOrderBy={(orderByValue) => {
            setOrderBy(String(orderByValue));
            onCloseOrderBy();
          }}
        />
      </ModalList>

      <Alert
        title="Cliente bloqueado"
        description="possui títulos atrasados com mais de 15 dias."
        isOpen={isOpenAlertBilletClient}
        onClose={onCloseAlertBilletClient}
      />

      <ModalSelectClient
        isOpen={isOpenSeleteClient}
        onClose={onCloseSeleteClient}
        setClient={(client) => {
          if (!!client?.titulo?.length && client?.titulo?.length >= 1) {
            onOpenAlertBilletClient();
          } else {
            createOrder({
              client,
              priceList: { codigo: 28, descricao: "28 DDL" },
            });
          }
        }}
      />

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get<Me>("/auth/me");

  const redirect = response.data.eCliente || response.data.eVendedor;

  if (!redirect)
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
