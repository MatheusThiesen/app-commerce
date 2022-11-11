import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { Me } from "../@types/me";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { setupAPIClient } from "../service/api";

import { withSSRAuth } from "../utils/withSSRAuth";

interface HomeProps {
  me: Me;
}

export default function Home({ me }: HomeProps) {
  return (
    <>
      <Head>
        <title>Inicio | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll user={{ name: me.email }} />

      <Box>
        {/* <BannerCarousel
          h="300"
          p="4"
          banners={[
            {
              id: "1",
              name: "Tenis Nike",
              uri: "https://i.pinimg.com/originals/fa/45/96/fa4596ad9a9d39901eeb455ed4f74e44.jpg",
            },
            {
              id: "2",
              name: "Logo Nike",
              uri: "https://www.qualitare.com/wp-content/uploads/2021/01/nike-banner.png",
            },
          ]}
        /> */}
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
