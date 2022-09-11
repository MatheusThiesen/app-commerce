import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { BottomNavigationProvider } from "../hooks/useBottomNavigation";
import { HeaderNavigationProvider } from "../hooks/useHeaderNavigation";
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
          <HeaderNavigationProvider>
            <BottomNavigationProvider>
              <Component {...pageProps} />
            </BottomNavigationProvider>
          </HeaderNavigationProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
