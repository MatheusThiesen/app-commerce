import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";
import { useInView } from "react-intersection-observer";
import { FilterList } from "../../../@types/api-queries";
import { Me } from "../../../@types/me";
import { FilterSelectedList } from "../../../components/FilterSelectedList";
import { HeaderNavigation } from "../../../components/HeaderNavigation";
import { HeaderToList } from "../../../components/HeaderToList";
import { ListFilter, SelectedFilter } from "../../../components/ListFilter";
import { LoadingInfiniteScroll } from "../../../components/LoadingInfiniteScroll";
import { ModalFilter } from "../../../components/ModalFilter";
import { ModalList } from "../../../components/ModalList";
import { ModalOrderBy } from "../../../components/ModalOrderBy";
import { PanelLayout } from "../../../components/PanelLayout";
import { Product } from "../../../components/Product";
import { ShoppingButton } from "../../../components/ShoppingButton";
import { useStore } from "../../../contexts/StoreContext";
import { spaceImages } from "../../../global/parameters";
import {
  productsOrderBy,
  useProducts,
} from "../../../hooks/queries/useProducts";
import { setupAPIClient } from "../../../service/api";
import { api } from "../../../service/apiClient";
import { withSSRAuth } from "../../../utils/withSSRAuth";

interface OrderProps {
  me: Me;
}

export default function Order({ me }: OrderProps) {
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
  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  const [dataFilters, setDataFilters] = useState<FilterList[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(true);
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [orderBy, setOrderBy] = useState<string>(() => {
    return "precoVenda.desc";
  });
  const [groupProduct, setGroupProduct] = useState<
    undefined | "codigoAlternativo"
  >();

  const { client, priceList, totalItems } = useStore();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
      pagesize: 20,
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
    });

  useEffect(() => {
    (async () => {
      setIsLoadingFilters(true);

      const { data } = await api.get<FilterList[]>("/products/filters", {
        params: {
          filters: [
            ...filters,
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
        },
      });
      setDataFilters(data);

      setIsLoadingFilters(false);
    })();
  }, [client, priceList]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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
            onClick={() => Router.push("/pedidos")}
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
        isLoading={isLoadingFilters}
        pt={["8rem", "8rem", "8rem", "7rem"]}
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
          <HeaderToList
            title="Produtos"
            isLoading={isLoading}
            orderBy={{
              onChange: setOrderBy,
              currentValue: orderBy,
              data: productsOrderBy,
            }}
          />

          <LoadingInfiniteScroll
            isLoading={isLoading}
            isLoadingNextPage={isFetchingNextPage}
          >
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
                        uri: `${spaceImages}/Produtos/${product.referencia}_01`,
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
        dataFilters={dataFilters}
        filters={filters}
        setFilters={setFilters}
      />

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

      <ModalList
        title="Carrinho (10)"
        isOpen={isOpenOrder}
        onClose={onCloseOrder}
      >
        <Box borderRadius="md"></Box>
      </ModalList>
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
