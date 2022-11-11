import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "../contexts/AuthContext";
import { BottomNavigationProvider } from "../hooks/useBottomNavigation";
import { ProductCatalogProvider } from "../hooks/useProductCatalog";
import { queryClient } from "../service/queryClient";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/appe-icon.png" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <ProductCatalogProvider>
              <BottomNavigationProvider>
                <Component {...pageProps} />
              </BottomNavigationProvider>
            </ProductCatalogProvider>
          </AuthProvider>
        </ChakraProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
