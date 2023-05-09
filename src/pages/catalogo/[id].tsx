import {
  Box,
  Flex,
  Image,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { PageCatalog } from "../../components/PageCatalog";
import { useCatalog } from "../../hooks/queries/useCatalog";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

interface CatalogProps {
  me?: Me;
}

export default function Catalog({ me }: CatalogProps) {
  const { ref, inView } = useInView();
  const history = useRouter();
  const toast = useToast();

  const [catalogId, setCatalogId] = useState("");

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCatalog({ id: String(id), pagesize: 5 });

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

  return (
    <>
      <Head>
        <title>Catálogo | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        user={me ? { name: me.email } : undefined}
      />

      {isLoading && (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      )}

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
            <Image
              maxW={120}
              src="https://alpar.sfo3.digitaloceanspaces.com/Alpar/alert.png"
            />
            <Text fontSize={"2xl"} fontWeight="bold" mt="8">
              {data?.pages[0].error}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex
          w="full"
          align="center"
          flexDir="column"
          pt={["1rem"]}
          pb={["7rem"]}
        >
          <Stack spacing="4" w="95%" maxW={1200}>
            {data?.pages.map((page) =>
              page?.products.map((product, i) =>
                i === page?.products?.length - 1 ? (
                  <Box ref={ref} key={product.imageMain}>
                    <PageCatalog
                      product={product}
                      date={page.dateToString ?? "-"}
                    />
                  </Box>
                ) : (
                  <PageCatalog
                    key={product.imageMain}
                    product={product}
                    date={page.dateToString ?? "-"}
                  />
                )
              )
            )}
          </Stack>

          {isFetchingNextPage && (
            <Flex w="100%" justify="center" align="center">
              <Spinner mt="4rem" ml="4" size="xl" />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };

  const apiClient = setupAPIClient(ctx);

  try {
    const response = await apiClient.get("/auth/me");

    return {
      props: {
        me: response.data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
