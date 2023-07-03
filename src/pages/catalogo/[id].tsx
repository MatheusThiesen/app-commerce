import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Keyboard, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { PageCatalog } from "../../components/PageCatalog";
import styles from "../../components/ProductImageCarouse/style.module.scss";
import { useLoading } from "../../contexts/LoadingContext";
import { spaceImages } from "../../global/parameters";
import {
  useCatalog,
  useCatalogTotalCount,
} from "../../hooks/queries/useCatalog";
import { api } from "../../service/apiClient";

interface CatalogProps {
  me?: Me;
}

export default function Catalog({ me }: CatalogProps) {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(1);

  const [catalogId, setCatalogId] = useState("");
  const { setLoading } = useLoading();

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCatalog({ id: String(id), pagesize: 10 });
  const total = useCatalogTotalCount(String(id));

  useEffect(() => {
    if (id && String(id) !== catalogId) {
      setCatalogId(String(id));
      api.patch(`/catalog/visit/${id}`).then();
    }
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    setLoading(isFetchingNextPage || isLoading);
  }, [isFetchingNextPage, isLoading]);

  return (
    <>
      <Head>
        <title>Catálogo | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll isNotNavigation />

      <Text
        textAlign="center"
        mt="0.6rem"
        mb="0.6rem"
        fontWeight="normal"
        fontSize="md"
      >
        {`${page} / ${total.data?.total || "-"}`}
      </Text>

      {data?.pages[0].isError ? (
        <Flex w="full" h="70vh" align="center" justify="center">
          <Flex
            flexDir="column"
            align="center"
            justify="center"
            bg="white"
            borderRadius="md"
            p="4rem"
            maxW={1200}
            w="90%"
          >
            <Image maxW={120} src={`${spaceImages}/Alpar/alert.png`} />
            <Text fontSize={"2xl"} fontWeight="bold" mt="8">
              {data?.pages[0].error}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex w="full" justify="center" overflow="hidden">
          <Box w="100%" maxW="1200px" flexDir="column" pb={["7rem"]}>
            <Swiper
              spaceBetween={50}
              centeredSlides={true}
              navigation={true}
              grabCursor={true}
              keyboard={{
                enabled: true,
              }}
              modules={[Pagination, Navigation, Keyboard]}
              className={styles["container-carousel-product"]}
              onSlideChange={(e) => setPage(e.realIndex + 1)}
            >
              {data?.pages.map((page) =>
                page?.products.map((product, i) =>
                  i === page?.products?.length - 1 ? (
                    <SwiperSlide key={product.imageMain} id={product.imageMain}>
                      <Box ref={ref} key={product.imageMain}>
                        <PageCatalog
                          product={product}
                          date={page.dateToString ?? "-"}
                        />
                      </Box>
                    </SwiperSlide>
                  ) : (
                    <SwiperSlide key={product.imageMain} id={product.imageMain}>
                      <PageCatalog
                        product={product}
                        date={page.dateToString ?? "-"}
                      />
                    </SwiperSlide>
                  )
                )
              )}
            </Swiper>
          </Box>
        </Flex>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
