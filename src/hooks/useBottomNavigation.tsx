import { Box } from "@chakra-ui/react";
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

  return (
    <BottomNavigationContext.Provider value={{}}>
      <Box pb={["5rem", "5rem", "5rem", "0"]} h="full" w="full">
        {children}
      </Box>

      {isAuthenticated && <Bottom height="3.5rem" />}
    </BottomNavigationContext.Provider>
  );
}

export const useBottomNavigation = () => useContext(BottomNavigationContext);
