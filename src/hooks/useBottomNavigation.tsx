import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext } from "react";
import { BottomNavigation as Bottom } from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";

type BottomNavigationContextData = {};

type BottomNavigationProviderProps = {
  children: ReactNode;
};

const BottomNavigationContext = createContext(
  {} as BottomNavigationContextData
);

export function BottomNavigationProvider({
  children,
}: BottomNavigationProviderProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isActive = ![
    "/produtos/[codigo]",
    "/clientes/[codigo]",
    "/pedidos/novo/produtos/[codigo]",
    "/pedidos/novo",
  ].includes(router.pathname);

  return (
    <BottomNavigationContext.Provider value={{}}>
      <Box
        pb={isActive ? ["5.5rem", "5.5rem", "5.5rem", "0"] : 0}
        h="full"
        w="full"
      >
        {children}
      </Box>

      {isAuthenticated && isActive && <Bottom height="4rem" />}
    </BottomNavigationContext.Provider>
  );
}

export const useBottomNavigation = () => useContext(BottomNavigationContext);
