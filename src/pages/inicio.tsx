import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { BannerCarousel } from "../components/BannerCarousel";
import { Header } from "../components/Header";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>

      <Header inativeEventScroll />

      <Box>
        <BannerCarousel
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
        />
      </Box>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("me");

  return {
    props: {},
  };
});
