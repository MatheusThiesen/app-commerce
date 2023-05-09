import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Me } from "../../@types/me";
import { Client } from "../../components/Client";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { ModalList } from "../../components/ModalList";
import { OrderBy } from "../../components/OrderBy";
import { OrderByMobile } from "../../components/OrderByMobile";
import { useClients } from "../../hooks/queries/useClients";
import { FilterList } from "../../hooks/queries/useProductsFilters";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

const OrderByItems = [
  {
    name: "Maior Código",
    value: "codigo.desc",
  },
  {
    name: "Menor Código",
    value: "codigo.asc",
  },
  {
    name: "Alfabética A>Z",
    value: "razaoSocial.asc",
  },
  {
    name: "Alfabética Z>A",
    value: "razaoSocial.desc",
  },
];

interface ClientProps {
  me: Me;
}

export default function Clientes({ me }: ClientProps) {
  const { ref, inView } = useInView();

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

  const [dataFilters, setDataFilters] = useState<FilterList[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(true);
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [orderBy, setOrderBy] = useState<string>(() => {
    return "codigo.desc";
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClients({
      pagesize: 10,
      orderby: orderBy,
      filters: filters,
    });

  useEffect(() => {
    (async () => {
      const { data } = await api.get<FilterList[]>("/clients/filters");
      setDataFilters(data);

      setIsLoadingFilters(false);
    })();
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      <Head>
        <title>Clientes | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me?.email }}
        title="Clientes"
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
                <Box borderRadius="md">
                  <FilterSelectedList
                    filters={filters}
                    setFilters={setFilters}
                  />

                  {dataFilters && (
                    <ListFilter
                      filters={dataFilters}
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
                    Clientes
                    {isLoading && <Spinner ml="4" size="md" />}
                  </Text>

                  <Flex justifyContent="space-between" mt="1" mb="2">
                    <Text fontSize="md" color="gray.600">
                      Total {data?.pages[data?.pages.length - 1].total}{" "}
                      resultados
                    </Text>

                    <OrderBy
                      onChange={setOrderBy}
                      currentValue={orderBy}
                      data={OrderByItems}
                    />
                  </Flex>
                </Flex>

                {isLoading ? (
                  <Flex h="50vh" w="100%" justify="center" align="center">
                    <Spinner ml="4" size="xl" />
                  </Flex>
                ) : (
                  <>
                    <Stack mb="1rem">
                      {data?.pages.map((page) =>
                        page?.clients.map((client, i) =>
                          i === page?.clients?.length - 3 ? (
                            <Link
                              key={client.codigo}
                              href={`/clientes/${client.codigo}`}
                              passHref
                            >
                              <ChakraLink
                                ref={ref}
                                _hover={{
                                  filter: "brightness(0.95)",
                                  cursor: "pointer",
                                }}
                              >
                                <Client client={client} />
                              </ChakraLink>
                            </Link>
                          ) : (
                            <Link
                              key={client.codigo}
                              href={`/clientes/${client.codigo}`}
                              passHref
                            >
                              <ChakraLink
                                _hover={{
                                  filter: "brightness(0.95)",
                                  cursor: "pointer",
                                }}
                              >
                                <Client client={client} />
                              </ChakraLink>
                            </Link>
                          )
                        )
                      )}
                    </Stack>

                    {isFetchingNextPage && (
                      <Flex w="100%" justify="center" align="center">
                        <Spinner mt="4" ml="4" size="lg" />
                      </Flex>
                    )}
                  </>
                )}
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
                  <ListFilter
                    filters={dataFilters}
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
              OrderByItems={OrderByItems}
              currentOrderByValue={orderBy}
              setOrderBy={(orderByValue) => {
                setOrderBy(String(orderByValue));
                onCloseOrderBy();
              }}
            />
          </ModalList>
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
