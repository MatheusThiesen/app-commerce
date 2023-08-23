import { useEffect } from "react";

import { useProducts } from "../../hooks/queries/useProducts";
import { ItemFilter } from "../../hooks/queries/useProductsFilters";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";
import { spaceImages } from "../../global/parameters";
import { LoadingInfiniteScroll } from "../LoadingInfiniteScroll";
import { Product } from "../Product";

interface Props {
  orderby?: string;
  filters?: ItemFilter[] | undefined;
  search?: string;
  distinct?: "codigoAlternativo" | "referencia";
}

export function ListProducts({ filters, orderby, distinct, search }: Props) {
  const { ref, inView } = useInView();
  const { setLoading } = useLoading();
  const { priceList } = useStore();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
      pagesize: 40,
      orderby,
      filters,
      distinct,
      search,
    });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
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
                        (f) => Number(f.codigo) === Number(priceList?.codigo)
                      )?.valorFormat ?? "-",
                    pdv: product.precoVendaFormat ?? "-",
                    uri: `${spaceImages}/Produtos/${
                      product.imagens && product.imagens[0]
                        ? product.imagens[0].nome
                        : product.referencia + "_01"
                    }_smaller`,
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
                      (f) => Number(f.codigo) === Number(priceList?.codigo)
                    )?.valorFormat ?? "-",
                  pdv: product.precoVendaFormat ?? "-",
                  uri: `${spaceImages}/Produtos/${
                    product.imagens && product.imagens[0]
                      ? product.imagens[0].nome
                      : product.referencia + "_01"
                  }_smaller`,
                }}
              />
            )
          )
        )}
      </SimpleGrid>
    </LoadingInfiniteScroll>
  );
}
