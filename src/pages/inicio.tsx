import { Box, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Me } from "../@types/me";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { setupAPIClient } from "../service/api";

import { useRouter } from "next/router";
import { BannerCarousel } from "../components/BannerCarousel";
import { useBanners } from "../hooks/queries/useBanners";
import { api } from "../service/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

interface HomeProps {
  me: Me;
}

export default function Home({ me }: HomeProps) {
  const { data } = useBanners();
  const router = useRouter();

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

      <HeaderNavigation isInativeEventScroll user={{ name: me.email }} />

      <Box p="4">
        <Text
          as="h1"
          textTransform="capitalize"
          fontSize="2xl"
          fontWeight="bold"
          mb="2"
        >
          Olá, {me.name}
        </Text>

        {(data?.banners.length ?? 0) > 0 && (
          <>
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
          </>
        )}
      </Box>
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
