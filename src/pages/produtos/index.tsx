import {
  Box,
  Button,
  Flex,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { IoBook } from "react-icons/io5";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { OrderBy } from "../../components/OrderBy";
import { Pagination } from "../../components/Pagination";
import { Product } from "../../components/Product";
import {
  ProductListFilter,
  SelectedFilter,
} from "../../components/ProductListFilter";
import { useProducts } from "../../hooks/queries/useProducts";

export default function Produtos() {
  const [filters, setFilters] = useState<SelectedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("codigo.desc");
  const { data, isError, isLoading } = useProducts({
    page,
    pagesize: 40,
    orderby: orderBy,
  });

  if (isError) return "Error";

  if (!data || isLoading) return "Loading";

  return (
    <>
      <Head>
        <title>Produtos - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        title="Produtos"
        Right={
          <Button colorScheme="none" display="flex" alignItems="center">
            <IoBook fontSize={"20"} color="white" />
          </Button>
        }
        contentHeight={2.5}
        content={
          <Flex w="full" justify="space-around">
            <Button bg="white" borderRadius={0} w="full">
              Ordenação
            </Button>
            <Button
              bg="white"
              borderRadius={0}
              borderLeft="1px solid #ccc"
              w="full"
            >
              Filtros
            </Button>
          </Flex>
        }
      />

      <Flex
        pt={["6.5rem", "6.5rem", "6.5rem", "7rem"]}
        pb={["2rem"]}
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
              onClick={() => {}}
            >
              <Text>CATÁLOGO</Text>
            </Button>

            <Box bg="white" borderRadius="md" p="6">
              {filters.length > 0 && (
                <Stack pb="4">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      Filtros selecionados ({filters.length})
                    </Text>
                  </Box>
                  <List spacing={3}>
                    {filters.map((item) => (
                      <ListItem>
                        <Text fontSize="sm">{item.name}</Text>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={() => setFilters([])}
                  >
                    Limpa Filtro
                  </Button>
                </Stack>
              )}
              <ProductListFilter
                filters={data?.filters}
                selectedFilter={filters}
                onChangeSelectedFilter={setFilters}
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
                  Exibindo: {data?.productsStartShow} - {data?.productsEndShow}{" "}
                  de {data?.total} resultados
                </Text>

                <OrderBy
                  onChange={setOrderBy}
                  currentValue={orderBy}
                  data={[
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
                  ]}
                />
              </Flex>
            </Flex>

            <SimpleGrid columns={[2, 2, 4, 4]} spacing="1" mb="1rem">
              {data?.products.map((product) => (
                <Product
                  key={product.codigo}
                  product={{
                    cod: product.codigo,
                    name: product.descricao,
                    reference: product.referencia,
                    priceSale: product.precoVendaFormat,
                    uri: `https://alpar.sfo3.digitaloceanspaces.com/Produtos/${product.referencia}_01`,
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
    </>
  );
}
