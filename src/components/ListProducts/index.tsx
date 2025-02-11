import { useEffect, useState } from "react";

import { useProducts } from "../../hooks/queries/useProducts";
import { ItemFilter } from "../../hooks/queries/useProductsFilters";

import { useAuth } from "@/contexts/AuthContext";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";
import { spaceImages } from "../../global/parameters";
import { useLocalStore } from "../../hooks/useLocalStore";
import { LoadingInfiniteScroll } from "../LoadingInfiniteScroll";
import { ModalProductAddToCart } from "../ModalProductAddToCart";
import { Product, ProductProps } from "../Product";

interface Props {
  orderby?: string;
  filters?: ItemFilter[] | undefined;
  search?: string;
  distinct?: "codigoAlternativo" | "referencia";

  isCatalog?: boolean;
  isButtonAddCart?: boolean;
  pathList?: "products" | "createOrder";
}

export function ListProducts({
  filters,
  orderby,
  distinct,
  search,
  isCatalog,
  isButtonAddCart,
  pathList = "products",
}: Props) {
  const { ref, inView } = useInView();
  const router = useRouter();
  const { setLoading } = useLoading();
  const { priceList } = useStore();
  const { user } = useAuth();

  const {
    data: scrollPosition,
    onRemove: onRemoveScrollPosition,
    onSet: onSetScrollPosition,
  } = useLocalStore("@ScrollY-Products-Order");
  const {
    data: scrollPositionProducts,
    onRemove: onRemoveScrollPositionProducts,
    onSet: onSetScrollPositionProducts,
  } = useLocalStore("@ScrollY-Products");

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
      pagesize: 40,
      orderby,
      filters,
      distinct,
      search,
    });

  const [modalProductAddToCart, setModalProductAddToCart] = useState<
    number | undefined
  >();

  function setPositionScroll() {
    onSetScrollPosition(window.scrollY.toString());
  }

  async function handleClickProduct() {
    setPositionScroll();
    setLoading(true);
  }

  async function handleProductAddToCart(product: ProductProps) {
    setModalProductAddToCart(product.cod);
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
    <>
      <LoadingInfiniteScroll isLoadingNextPage={isFetchingNextPage}>
        <SimpleGrid columns={[2, 2, 3, 4]} spacing="2" mb="1rem">
          {data?.pages.map((page) =>
            page?.products.map((product, i) =>
              i === page?.products.length - 4 ? (
                <Box key={product.codigo} ref={ref}>
                  <Product
                    isCatalog={isCatalog}
                    onClickProduct={handleClickProduct}
                    onAddCard={
                      isButtonAddCart ? handleProductAddToCart : undefined
                    }
                    hrefBack={router.asPath.replaceAll("&", "!")}
                    href={
                      pathList === "createOrder"
                        ? "pedidos/novo/produtos"
                        : "produtos"
                    }
                    product={{
                      cod: product.codigo,
                      name: product.descricao,
                      descriptionAdditional: product.descricaoAdicional,
                      reference: product.referencia,
                      amount: "PDV " + product.precoVendaFormat ?? "-",
                      uri: `${spaceImages}/Produtos/${
                        product?.imagemPreview
                          ? product.imagemPreview
                          : product.referencia + "_01"
                      }_smaller`,
                      subInfo: isButtonAddCart
                        ? `${!!user?.cliente ? "" : priceList?.descricao} ${
                            //@ts-ignore
                            product[`precoTabela${priceList?.codigo}Format`]
                          }`
                        : undefined,
                    }}
                  />
                </Box>
              ) : (
                <Product
                  isCatalog={isCatalog}
                  onClickProduct={handleClickProduct}
                  onAddCard={
                    isButtonAddCart ? handleProductAddToCart : undefined
                  }
                  hrefBack={router.asPath.replaceAll("&", "!")}
                  href={
                    pathList === "createOrder"
                      ? "pedidos/novo/produtos"
                      : "produtos"
                  }
                  key={product.codigo}
                  product={{
                    cod: product.codigo,
                    name: product.descricao,
                    descriptionAdditional: product.descricaoAdicional,
                    reference: product.referencia,
                    amount: "PDV " + product.precoVendaFormat ?? "-",
                    uri: `${spaceImages}/Produtos/${
                      product?.imagemPreview
                        ? product.imagemPreview
                        : product.referencia + "_01"
                    }_smaller`,
                    subInfo: isButtonAddCart
                      ? `${!!user?.cliente ? "" : priceList?.descricao} ${
                          //@ts-ignore
                          product[`precoTabela${priceList?.codigo}Format`]
                        }`
                      : undefined,
                  }}
                />
              )
            )
          )}
        </SimpleGrid>
      </LoadingInfiniteScroll>

      <ModalProductAddToCart
        productCode={modalProductAddToCart}
        onClose={() => {
          setModalProductAddToCart(undefined);
        }}
      />
    </>
  );
}
