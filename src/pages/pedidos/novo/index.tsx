import {
  Box,
  Button,
  Flex,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";

import { setupAPIClient } from "../../../service/api";
import { withSSRAuth } from "../../../utils/withSSRAuth";

import { Me } from "../../../@types/me";

import { useStore } from "../../../contexts/StoreContext";
import { productsOrderBy } from "../../../hooks/queries/useProducts";
import { useProductsFilters } from "../../../hooks/queries/useProductsFilters";
import { useQueryParams } from "../../../hooks/useQueryParams";
import {
  queryParamsToFiltersNormalized,
  useQueryParamsFilterList,
} from "../../../hooks/useQueryParamsFilterList";

import { TbShoppingCartCancel } from "react-icons/tb";
import { Accordion } from "../../../components/Accordion";
import { Cart } from "../../../components/Cart";
import { FilterRangeAmount } from "../../../components/FilterRangeAmount";
import { FilterSelectedList } from "../../../components/FilterSelectedList";
import { HeaderNavigation } from "../../../components/HeaderNavigation";
import { HeaderToList } from "../../../components/HeaderToList";
import { ListFilter, SelectedFilter } from "../../../components/ListFilter";
import { ListProducts } from "../../../components/ListProducts";
import { ModalAlert } from "../../../components/ModalAlert";
import { ModalFilter } from "../../../components/ModalFilter";
import { ModalOrderBy } from "../../../components/ModalOrderBy";
import { PanelLayout } from "../../../components/PanelLayout";
import { Search } from "../../../components/Search";
import { ShoppingButton } from "../../../components/ShoppingButton";

interface OrderProps {
  me: Me;
}

export default function Order({ me }: OrderProps) {
  const router = useRouter();
  const { setQueryParams } = useQueryParams({ router });
  const { client, priceList, totalItems, exitOrder } = useStore();

  const {
    isOpen: isConfirmExitOrder,
    onOpen: onOpenConfirmExitOrder,
    onClose: onCloseConfirmExitOrder,
  } = useDisclosure();
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
    return router?.query?.search ? String(router.query.search) : "";
  });
  const [orderBy, setOrderBy] = useState<string>(() => {
    return router?.query?.orderby
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

  useQueryParamsFilterList({
    router,
    filters,
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

  return (
    <>
      <Head>
        <title>Pedido | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        user={{ name: me?.email }}
        title="Pedido"
        contentHeight={4}
        Right={<ShoppingButton qtdItens={totalItems} onClick={onOpenOrder} />}
        Left={
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
        }
        Center={
          <Flex
            width={"100%"}
            paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}
            flexDir="column"
            mt={["0", "0", "0", "5"]}
          >
            <Search
              size="md"
              setSearch={setSearch}
              search={search}
              placeholder="Buscar na Alpar do Brasil por produtos"
            />
            <Flex
              w="full"
              h="1.5rem"
              align="center"
              justify="space-between"
              color="white"
              pt="2"
              display={["none", "none", "none", "flex"]}
            >
              <Text fontWeight="normal" fontSize="sm">
                {!!client?.codigo
                  ? `${client?.codigo} - ${client?.razaoSocial}`
                  : "-"}
              </Text>

              <Text fontWeight="normal" fontSize="sm">
                {!!priceList?.codigo ? `${priceList?.descricao}` : "-"}
              </Text>
            </Flex>
          </Flex>
        }
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
        isNotNavigation
      />

      <PanelLayout
        isLoading={isLoadingProductsFilters}
        pt={["8rem", "8rem", "8rem", "8rem"]}
      >
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
            <FilterSelectedList filters={filters} setFilters={setFilters} />

            {productsFilters?.filters.find((f) => f.name === "salePrices")
              ?.name && (
              <Accordion isOpen title="Preço de venda" mb="2">
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
                  (f) => !["salePrices", "concept"].includes(f.name)
                )}
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
            orderBy={{
              onChange: setOrderBy,
              currentValue: orderBy,
              data: productsOrderBy,
            }}
          />
          {client && priceList && (
            <ListProducts
              orderby={orderBy}
              distinct={groupProduct ? "codigoAlternativo" : undefined}
              search={search}
              filters={[
                ...filters,
                {
                  value: client?.codigo,
                  name: "clientCod",
                  field: "clientCod",
                },
              ]}
            />
          )}
        </Box>
      </PanelLayout>

      <ModalFilter
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        dataFilters={
          productsFilters?.filters?.filter(
            (f) => !["salePrices", "concept"].includes(f.name)
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
          {productsFilters?.filters.find((f) => f.name === "salePrices")
            ?.name && (
            <Accordion isOpen title="Preço de venda" mb="2">
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

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
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
