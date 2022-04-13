import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { makeServer } from "../service/mirage";
import { queryClient } from "../service/queryClient";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  if (process.env.NODE_ENV !== "development") {
    makeServer();
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
