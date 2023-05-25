import { Center, Spinner } from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type LoadingContextData = {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const LoadingContext = createContext({} as LoadingContextData);

export function LoadingProvider({ children }: AuthProviderProps) {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && (
        <Center
          position="fixed"
          w="100vw"
          h="100vh"
          bg="white"
          zIndex={99999}
          opacity={0.75}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="xl"
          />
        </Center>
      )}

      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
