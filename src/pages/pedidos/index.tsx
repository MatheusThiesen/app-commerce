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
import { withSSRAuth } from "../../utils/withSSRAuth";

import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";

import { Client } from "../../hooks/queries/useClients";
import { useOrders } from "../../hooks/queries/useOrder";
import { useOrdersFilters } from "../../hooks/queries/useOrdersFilters";

import { Alert } from "../../components/Alert";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { LoadingInfiniteScroll } from "../../components/LoadingInfiniteScroll";
import { ModalList } from "../../components/ModalList";
import { ModalSelectClient } from "../../components/ModalSelectClient";
import { ModalSelectPriceList } from "../../components/ModalSelectPriceList";
import { Order } from "../../components/Order";
import { OrderBy } from "../../components/OrderBy";
import { OrderByMobile } from "../../components/OrderByMobile";
import { PanelLayout } from "../../components/PanelLayout";
import { Search } from "../../components/Search";

interface OrdersProps {
  me: Me;
}

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

export default function Orders({ me }: OrdersProps) {
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
    isOpen: isOpenSeleteListPrice,
    onOpen: onOpenSeleteListPrice,
    onClose: onCloseSeleteListPrice,
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
  const [client, setClient] = useState<Client | undefined>(undefined);
  const { setLoading } = useLoading();

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

  const { createOrder } = useStore();

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
        user={{ name: me?.email }}
        title="Pedidos"
        Right={
          <Button
            onClick={onOpenSeleteClient}
            variant="unstyled"
            display={["flex", "flex", "flex", "none"]}
            justifyContent="center"
            alignItems="center"
          >
            <IoMdAddCircle color="white" fontSize={"1.8rem"} />
          </Button>
        }
        contentHeight={2.5}
        Center={
          <Box width={"100%"} paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}>
            <Search
              size="md"
              setSearch={setSearch}
              search={search}
              placeholder="Buscar na Alpar do Brasil por pedidos"
            />
          </Box>
        }
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

      <PanelLayout isLoading={isLoadingFilters}>
        <Flex w="full" maxW="1200px">
          <Flex
            w="22rem"
            mr="3rem"
            display={["none", "none", "none", "flex"]}
            flexDirection="column"
          >
            <Box borderRadius="md">
              <FilterSelectedList filters={filters} setFilters={setFilters} />

              {dataFilters && (
                <ListFilter
                  filters={dataFilters.filters}
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
                <Button type="button" ml="2" onClick={onOpenSeleteClient}>
                  <Icon
                    as={IoMdAddCircle}
                    color="red.500"
                    fontSize={"1.8rem"}
                  />
                </Button>
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
                filters={dataFilters.filters}
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
        description="possui títulos atrasados com mais de 7 dias."
        isOpen={isOpenAlertBilletClient}
        onClose={onCloseAlertBilletClient}
      />

      <ModalSelectClient
        isOpen={isOpenSeleteClient}
        onClose={onCloseSeleteClient}
        setClient={(data) => {
          if (!!data?.titulo?.length && data?.titulo?.length >= 1) {
            onOpenAlertBilletClient();
          } else {
            onOpenSeleteListPrice();
            setClient(data);
          }
        }}
      />

      <ModalSelectPriceList
        isOpen={isOpenSeleteListPrice}
        onClose={onCloseSeleteListPrice}
        setPriceList={(data) => {
          if (client) createOrder({ client, priceList: data });
        }}
      />
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get<Me>("/auth/me");

  if (response.data.eVendedor === false)
    return {
      redirect: {
        destination: "/produtos",
        permanent: true,
      },
    };

  return {
    props: {
      me: response.data,
    },
  };
});
