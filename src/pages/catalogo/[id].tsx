import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/thumbs";

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard } from "react-swipeable-views-utils";
import {
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Scrollbar,
  Grid as SwiperGrid,
  Thumbs,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../components/ProductImageCarouse/style.module.scss";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

import { PageCatalog } from "../../components/PageCatalog";
import { Search } from "../../components/Search";
import { SwitchLayout } from "../../components/SwitchLayout";
import { useLoading } from "../../contexts/LoadingContext";
import { defaultNoImage } from "../../global/parameters";
import {
  useCatalog,
  useCatalogTotalCount,
} from "../../hooks/queries/useCatalog";
import { api } from "../../service/apiClient";

const Swipeable = bindKeyboard(SwipeableViews);

export default function Catalog() {
  const [isLargerThan] = useMediaQuery("(min-width: 820px)");
  const sliderRef = useRef(null);

  const { ref, inView } = useInView();
  const [pageSwipe, setPageSwipe] = useState<number>(0);

  const [layout, setLayout] = useState<1 | 2 | 3>(1);

  const [catalogId, setCatalogId] = useState("");
  const { setLoading, setTheme } = useLoading();

  const [search, setSearch] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCatalog({ id: String(id), pagesize: 10, search });
  const total = useCatalogTotalCount(String(id), search);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;

    //@ts-ignore
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    //@ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);

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
    if (data && pageSwipe + 1 >= data?.pages.length * 10 && hasNextPage) {
      fetchNextPage();
    }
  }, [pageSwipe, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (isFetchingNextPage || isLoading) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    setLoading(isFetchingNextPage || isLoading);
  }, [isFetchingNextPage, isLoading]);

  return (
    <>
      <Head>
        <title>Catálogo | App Alpar do Brasil</title>
      </Head>

      <Box
        bg="blackAlpha.800"
        position="fixed"
        h="100vh"
        w="100vw"
        overflowY="scroll"
      >
        <Center as="header">
          <Flex
            maxW="1300px"
            w="full"
            justify="space-between"
            align="center"
            flexDir={["column", "column", "column", "row"]}
            marginBottom="4"
            marginTop="4"
          >
            <Flex justify="center" align="center" columnGap="8">
              <Image
                py="1"
                h={["70px", "70px", "70px", "70px"]}
                objectFit="contain"
                src="/assets/logo-white.png"
              />

              <SwitchLayout
                layout={layout}
                setLayout={(l) => {
                  setPageSwipe(l === 2 ? 3 : 0);
                  setLayout(l);
                }}
              />
            </Flex>

            {data?.pages[0].dateToString && (
              <>
                <Text
                  textAlign="center"
                  mt="0.6rem"
                  mb="0.6rem"
                  fontWeight="light"
                  fontSize="lg"
                  color="white"
                >
                  {` ${
                    layout === 2
                      ? `${pageSwipe + 1 - 4} - ${pageSwipe + 1}`
                      : pageSwipe + 1
                  } / ${total.data?.total || "-"}`}
                </Text>

                <Search
                  handleChangeSearch={(search) => {
                    setSearch(search);
                  }}
                  currentSearch={search}
                  placeholder="Buscar"
                  size="sm"
                />
              </>
            )}
          </Flex>
        </Center>

        <Center overflow="hidden">
          {total.isLoading ? null : data?.pages[0].isError ? (
            <Flex w="full" h="full" align="center" justify="center">
              <Flex
                flexDir="column"
                align="center"
                justify="center"
                bg="white"
                borderRadius="md"
                p="4rem"
              >
                <Image
                  maxW={120}
                  src={`https://alpar.sfo3.digitaloceanspaces.com/Alpar/alert.png`}
                />
                <Text fontSize={"2xl"} fontWeight="bold" mt="8">
                  {data?.pages[0].error}
                </Text>
              </Flex>
            </Flex>
          ) : total?.data?.total === undefined || total?.data?.total <= 0 ? (
            <Flex w="full" h="full" align="center" justify="center">
              <Flex
                flexDir="column"
                align="center"
                justify="center"
                bg="white"
                borderRadius="md"
                p="4rem"
              >
                <Image
                  maxW={120}
                  src={`https://alpar.sfo3.digitaloceanspaces.com/Alpar/lupa.png`}
                />
                <Text fontSize={"2xl"} fontWeight="bold" mt="8">
                  Sua pesquisa não retornou nenhum resultado
                </Text>
              </Flex>
            </Flex>
          ) : (
            <Center w="100%">
              {layout === 1 && (
                <>
                  <Button
                    variant="unstyled"
                    onClick={() => setPageSwipe((p) => (p < 1 ? p : p - 1))}
                  >
                    <Icon color="white" fontSize="5xl" as={MdArrowBackIosNew} />
                  </Button>

                  <Box
                    w="100%"
                    maxW="1300px"
                    bg="white"
                    flexDir="column"
                    borderRadius="lg"
                  >
                    <Swipeable
                      enableMouseEvents
                      index={pageSwipe}
                      onChangeIndex={setPageSwipe}
                    >
                      {data?.pages.map((page) =>
                        page?.products.map((product, i) => (
                          <Box key={product.imageMain}>
                            <PageCatalog product={product} />
                          </Box>
                        ))
                      )}
                    </Swipeable>
                  </Box>

                  <Button
                    variant="unstyled"
                    onClick={() =>
                      setPageSwipe((p) => {
                        if (p >= Number(total.data?.total) - 1) {
                          return p;
                        }

                        return p + 1;
                      })
                    }
                  >
                    <Icon color="white" fontSize="5xl" as={MdArrowForwardIos} />
                  </Button>
                </>
              )}

              {layout === 2 && (
                <>
                  <Button variant="unstyled" onClick={handlePrev}>
                    <Icon color="white" fontSize="5xl" as={MdArrowBackIosNew} />
                  </Button>

                  <Box
                    w="100%"
                    maxW="1300px"
                    flexDir="column"
                    borderRadius="lg"
                  >
                    <Swiper
                      slidesPerView={2}
                      grid={{
                        rows: 2,
                        fill: "row",
                      }}
                      keyboard={{
                        enabled: true,
                      }}
                      spaceBetween={30}
                      modules={[SwiperGrid, Navigation, Keyboard]}
                      navigation={false}
                      onSlideChange={(e) => setPageSwipe(2 * e.realIndex + 3)}
                      ref={sliderRef}
                    >
                      {data?.pages.map((page) =>
                        page?.products.map((product) => (
                          <SwiperSlide>
                            <PageCatalog product={product} type="small" />
                          </SwiperSlide>
                        ))
                      )}
                    </Swiper>
                  </Box>

                  <Button variant="unstyled" onClick={handleNext}>
                    <Icon color="white" fontSize="5xl" as={MdArrowForwardIos} />
                  </Button>
                </>
              )}

              {layout === 3 && (
                <>
                  <Button
                    variant="unstyled"
                    onClick={() => setPageSwipe((p) => p - 1)}
                  >
                    <Icon color="white" fontSize="5xl" as={MdArrowBackIosNew} />
                  </Button>

                  <Box
                    w="100%"
                    maxW="1300px"
                    bg="white"
                    flexDir="column"
                    borderRadius="lg"
                  >
                    <Swipeable
                      enableMouseEvents
                      index={pageSwipe}
                      onChangeIndex={setPageSwipe}
                    >
                      {data?.pages.map((page) =>
                        page?.products.map((product, i) => (
                          <Box key={product.imageMain}>
                            <PageCatalog product={product} type="medium" />
                          </Box>
                        ))
                      )}
                    </Swipeable>

                    <Box py="2" bg="gray.100">
                      <Swiper
                        spaceBetween={8}
                        slidesPerView={isLargerThan ? 6 : 3}
                        freeMode={true}
                        scrollbar={true}
                        mousewheel={true}
                        watchSlidesProgress={true}
                        modules={[
                          FreeMode,
                          Navigation,
                          Thumbs,
                          Scrollbar,
                          Mousewheel,
                        ]}
                        className={styles["container-carousel-product"]}
                      >
                        {data?.pages.map((page, indexUm) =>
                          page?.products.map((product, indexDois) => {
                            let realIndex = 10 * indexUm + indexDois;

                            return indexDois === page?.products?.length - 1 ? (
                              <SwiperSlide
                                key={product.imageMain}
                                id={product.imageMain}
                              >
                                <Box
                                  ref={ref}
                                  key={product.imageMain}
                                  borderColor="blackAlpha.800"
                                  bg="white"
                                  borderRadius="lg"
                                  p="2"
                                  borderWidth={
                                    pageSwipe === realIndex ? 2 : undefined
                                  }
                                  h="24"
                                  cursor="pointer"
                                  onClick={() => setPageSwipe(realIndex)}
                                >
                                  <Image
                                    w="140px"
                                    maxH="full"
                                    src={product.imageMain + "_smaller"}
                                    objectFit="contain"
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null; // prevents looping
                                      currentTarget.src = defaultNoImage;
                                    }}
                                  />
                                </Box>
                              </SwiperSlide>
                            ) : (
                              <SwiperSlide
                                key={product.imageMain}
                                id={product.imageMain}
                              >
                                <Center
                                  borderColor="blackAlpha.800"
                                  borderRadius="lg"
                                  p="2"
                                  borderWidth={
                                    pageSwipe === realIndex ? 2 : undefined
                                  }
                                  h="24"
                                  cursor="pointer"
                                  bg="white"
                                  onClick={() => setPageSwipe(realIndex)}
                                >
                                  <Image
                                    w="140px"
                                    maxH="full"
                                    src={product.imageMain + "_smaller"}
                                    objectFit="contain"
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null; // prevents looping
                                      currentTarget.src = defaultNoImage;
                                    }}
                                  />
                                </Center>
                              </SwiperSlide>
                            );
                          })
                        )}
                      </Swiper>
                    </Box>
                  </Box>

                  <Button
                    variant="unstyled"
                    onClick={() => setPageSwipe((p) => p + 1)}
                  >
                    <Icon color="white" fontSize="5xl" as={MdArrowForwardIos} />
                  </Button>
                </>
              )}
            </Center>
          )}
        </Center>

        {!isLoading &&
          !total?.isLoading &&
          total?.data?.total &&
          total?.data?.total > 0 && (
            <Center as="footer">
              <Flex
                maxW="1300px"
                w="full"
                align="flex-end"
                justify="space-between"
                padding="4"
                h="5%"
              >
                <Text
                  as="p"
                  fontWeight="bold"
                  fontSize={["0.675rem", "0.675rem", "sm", "sm"]}
                  color="white"
                >
                  * PRODUTOS ESTÃO SUJEITOS A ALTERAÇÕES CONFORME
                  DISPONIBILIDADE *
                </Text>
                <Text
                  as="p"
                  fontSize={["0.675rem", "0.675rem", "0.675rem", "smaller"]}
                  color="white"
                >
                  Data de criação {data?.pages[0].dateToString}
                </Text>
              </Flex>
            </Center>
          )}
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
