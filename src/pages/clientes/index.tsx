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
import { Client } from "../../components/Client";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { ModalFilter } from "../../components/ModalFilter";
import { ModalOrderBy } from "../../components/ModalOrderBy";
import { OrderBy } from "../../components/OrderBy";
import { PanelLayout } from "../../components/PanelLayout";
import { Search } from "../../components/Search";
import { useClients } from "../../hooks/queries/useClients";
import { FilterList } from "../../hooks/queries/useProductsFilters";
import { api } from "../../service/apiClient";

const clientOrderByItems = [
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

export default function Clientes() {
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
  const [search, setSearch] = useState("");
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
      search: search,
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
        title="Clientes"
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
              size="md"
              handleChangeSearch={(search) => {
                setSearch(search);
              }}
              currentSearch={search}
              placeholder="Buscar na Alpar do Brasil por clientes"
            />
          </Box>
        }
      />

      <PanelLayout isLoading={isLoadingFilters}>
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
                filters={dataFilters}
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
              Clientes
              {isLoading && <Spinner ml="4" size="md" />}
            </Text>

            <Flex justifyContent="space-between" mt="1" mb="2">
              <Text fontSize="md" color="gray.600">
                Total {data?.pages[data?.pages.length - 1].total} resultados
              </Text>

              <OrderBy
                onChange={setOrderBy}
                currentValue={orderBy}
                data={clientOrderByItems}
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
      </PanelLayout>

      <ModalFilter
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        dataFilters={dataFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <ModalOrderBy
        isOpen={isOpenOrderBy}
        onClose={onCloseOrderBy}
        orderByItems={clientOrderByItems}
        currentOrderByValue={orderBy}
        setOrderBy={(orderByValue) => {
          setOrderBy(String(orderByValue));
          onCloseOrderBy();
        }}
      />
    </>
  );
}
