import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoBook } from "react-icons/io5";
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
import { useProducts } from "../../hooks/queries/useProducts";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface ProductsProps {
  me: Me;
}

const OrderByItems = [
  {
    name: "Maior Cód. Produto",
    value: "codigo.desc",
  },
  {
    name: "Menor Cód. Produto",
    value: "codigo.asc",
  },
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
  const { query } = useRouter();
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
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [page, setPage] = useState(() => {
    if (!isNaN(Number(query?.page))) return Number(query.page);

    return 1;
  });
  const [orderBy, setOrderBy] = useState<string>(() => {
    if (query?.orderby) return String(query?.orderby);

    return "codigo.desc";
  });
  const { data, isError, isLoading } = useProducts({
    page,
    pagesize: 40,
    orderby: orderBy,
    filters: filters,
  });

  if (isError) return "Error";

  return (
    <>
      <Head>
        <title>Produtos - App Alpar do Brasil</title>
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

      {!data || isLoading ? (
        "Loading"
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
                w="25rem"
                mr="3rem"
                display={["none", "none", "none", "flex"]}
                flexDirection="column"
              >
                <Button
                  leftIcon={<IoBook fontSize={"20"} />}
                  colorScheme="blue"
                  // variant="outline"
                  mb="1rem"
                  onClick={() => {
                    onChangeActivatedProductCatalog((oldDate) => !oldDate);
                  }}
                >
                  <Text>CATÁLOGO</Text>
                </Button>

                <Box borderRadius="md" p="6">
                  <FilterSelectedList
                    filters={filters}
                    setFilters={setFilters}
                  />

                  <ProductListFilter
                    filters={data?.filters.filter((f) => f.data.length > 0)}
                    selectedFilter={filters}
                    onChangeSelectedFilter={(a) => {
                      setPage(1);

                      setFilters(a);
                    }}
                    isOpen
                  />
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
                <ProductListFilter
                  filters={data?.filters.filter((f) => f.data.length > 0)}
                  selectedFilter={filters}
                  onChangeSelectedFilter={(a) => {
                    setPage(1);
                    setFilters(a);
                  }}
                />
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

      {isActivatedCatalog && (
        <Flex
          bg="white"
          position="fixed"
          bottom="0"
          left="0"
          w="full"
          justify={"center"}
          boxShadow="dark-lg"
        >
          <Flex maxW="900px" w="full" px="8" py="6" justify="space-between">
            <Box>
              <Text fontSize="3xl" fontWeight="bold">
                CATÁLOGO
              </Text>
            </Box>

            <Stack>
              <Text color="gray.500">{`${productsSelectedCatalog.length}/500 produtos selecionados`}</Text>

              <Stack direction="row" spacing="4">
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  color="gray.800"
                  onClick={onGenerateCatalog}
                >
                  IMPRIMIR
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  color="gray.800"
                  onClick={() => onSelectedAllProductCatalog(filters)}
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
