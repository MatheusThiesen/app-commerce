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
import { SiMicrosoftexcel } from "react-icons/si";
import { FilterList } from "../../@types/api-queries";
import { Me } from "../../@types/me";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { ModalList } from "../../components/ModalList";
import { Order } from "../../components/Order";
import { OrderBy } from "../../components/OrderBy";
import { OrderByMobile } from "../../components/OrderByMobile";
import { useStore } from "../../contexts/StoreContext";
import { useClients } from "../../hooks/queries/useClients";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

const orders = [
  {
    id: "1",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
  {
    id: "2",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
  {
    id: "3",
    createAt: "04 de Janeiro 2022",
    code: "35591",
    totalValue: "R$ 1.000,00",
    paymentTerms: "VENDA 56 - 30/60/90 DIAS",
    brand: {
      name: "LA MARTINA",
    },
    client: {
      code: "35591",
      cnpj: "04.896.434/0001-72",
      brandName: "A LEANDRO BAZAR E PAPELARIA",
      address: {
        street: "AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018",
        city: "BOM PRINCÍPIO,GRAVATAÍ - RS",
      },
    },
  },
];

interface OrdersProps {
  me: Me;
}

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

  const [dataFilters, setDataFilters] = useState<FilterList[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(true);
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [orderBy, setOrderBy] = useState<string>(() => {
    return "codigo.desc";
  });

  const { setClient, setPriceList } = useStore();
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

  function handleCreateOrder() {
    setClient({} as any);
    setPriceList({} as any);
  }

  return (
    <>
      <Head>
        <title>Pedidos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me?.email }}
        title="Pedidos"
        Right={
          <Link href={`/pedidos/novo`} passHref>
            <ChakraLink mr="4" onClick={handleCreateOrder}>
              <IoMdAddCircle color="white" fontSize={"1.8rem"} />
            </ChakraLink>
          </Link>
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
                    Pedidos
                    {isLoading && <Spinner ml="4" size="md" />}
                    <Button type="button" ml="2" onClick={() => {}}>
                      <Icon
                        as={SiMicrosoftexcel}
                        fontSize="1.5rem"
                        color="#147b45"
                        ml="-1"
                      />
                    </Button>
                    <Button type="button" ml="2" onClick={handleCreateOrder}>
                      <Link href={`/pedidos/novo`} passHref>
                        <ChakraLink>
                          <Icon
                            as={IoMdAddCircle}
                            color="red.500"
                            fontSize={"1.8rem"}
                          />
                        </ChakraLink>
                      </Link>
                    </Button>
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

                <Stack>
                  {orders.map((order) => (
                    <Order />
                  ))}
                </Stack>
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
