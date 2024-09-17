import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../service/apiClient";

import { ShoppingButton } from "@/components/ShoppingButton";
import { useStore } from "@/contexts/StoreContext";
import { BannerCarousel } from "../components/BannerCarousel";
import { Cart } from "../components/Cart";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { useAuth } from "../contexts/AuthContext";
import { useBanners } from "../hooks/queries/useBanners";

export default function Home() {
  const { data } = useBanners();
  const router = useRouter();
  const { user } = useAuth();

  const { totalItems } = useStore();
  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  async function handlePressBanner(bannerId: string) {
    const find = data?.banners.find((f) => f.id === bannerId);

    if (find) {
      router.push("/produtos" + `?banners=${find.titulo}|${find.id}`);
      await api.patch(`/panel/banners/click/${find.id}`);
    }
  }

  return (
    <>
      <Head>
        <title>Inicio | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        Right={
          user.eCliente && (
            <ShoppingButton
              qtdItens={totalItems}
              onClick={onOpenOrder}
              disabledTitle
            />
          )
        }
      />

      <Flex pt={"2rem"} pb={["7rem"]} justify="center" w="full">
        <Flex w="full" maxW="1350px" flexDir="column">
          <Text
            as="h1"
            textTransform="capitalize"
            fontSize="2xl"
            fontWeight="bold"
            mb="2"
          >
            Olá, {user?.nome}
          </Text>

          {(data?.banners.length ?? 0) > 0 && (
            <Box w="100%">
              <BannerCarousel
                h="20rem"
                display={["none", "none", "none", "flex"]}
                onPress={handlePressBanner}
                banners={
                  data?.banners.map((banner) => ({
                    id: banner.id,
                    name: banner.titulo,
                    uri: banner.imagemDesktop.url,
                  })) ?? []
                }
              />
              <BannerCarousel
                h="27rem"
                display={["flex", "flex", "flex", "none"]}
                onPress={handlePressBanner}
                banners={
                  data?.banners.map((banner) => ({
                    id: banner.id,
                    name: banner.titulo,
                    uri: banner.imagemMobile.url,
                  })) ?? []
                }
              />
            </Box>
          )}
        </Flex>
      </Flex>

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
    </>
  );
}
