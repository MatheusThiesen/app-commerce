import { useEffect } from "react";

import { useProducts } from "../../hooks/queries/useProducts";
import { ItemFilter } from "../../hooks/queries/useProductsFilters";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";
import { spaceImages } from "../../global/parameters";
import { useLocalStore } from "../../hooks/useLocalStore";
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
  const {
    data: scrollPosition,
    onRemove: onRemoveScrollPosition,
    onSet: onSetScrollPosition,
  } = useLocalStore("@ScrollY-Products-Order");

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
      pagesize: 40,
      orderby,
      filters,
      distinct,
      search,
    });

  function setPositionScroll() {
    onSetScrollPosition(window.scrollY.toString());
  }

  async function handleClickProduct() {
    setPositionScroll();
    setLoading(true);
  }

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    setTimeout(() => {
      const scrollY = Number(scrollPosition);
      if (!isNaN(scrollY)) {
        window.scrollTo({ top: scrollY, behavior: "smooth" });
        onRemoveScrollPosition();
      }
    }, 500);
  }, [scrollPosition]);

  return (
    <LoadingInfiniteScroll isLoadingNextPage={isFetchingNextPage}>
      <SimpleGrid columns={[2, 2, 3, 4]} spacing="1" mb="1rem">
        {data?.pages.map((page) =>
          page?.products.map((product, i) =>
            i === page?.products.length - 4 ? (
              <Box key={product.codigo} ref={ref}>
                <Product
                  onClickProduct={handleClickProduct}
                  href="pedidos/novo/produtos"
                  product={{
                    cod: product.codigo,
                    name: product.descricao,
                    descriptionAdditional: product.descricaoAdicional,
                    reference: product.referencia,
                    subInfo:
                      //@ts-ignore
                      product[`precoTabela${priceList?.codigo}Format`],
                    amount: "PDV " + product.precoVendaFormat ?? "-",
                    uri: `${spaceImages}/Produtos/${
                      product?.imagemPreview
                        ? product.imagemPreview
                        : product.referencia + "_01"
                    }_smaller`,
                  }}
                />
              </Box>
            ) : (
              <Product
                onClickProduct={handleClickProduct}
                href="pedidos/novo/produtos"
                key={product.codigo}
                product={{
                  cod: product.codigo,
                  name: product.descricao,
                  descriptionAdditional: product.descricaoAdicional,
                  reference: product.referencia,
                  subInfo:
                    //@ts-ignore
                    product[`precoTabela${priceList?.codigo}Format`],
                  amount: "PDV " + product.precoVendaFormat ?? "-",
                  uri: `${spaceImages}/Produtos/${
                    product?.imagemPreview
                      ? product.imagemPreview
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
