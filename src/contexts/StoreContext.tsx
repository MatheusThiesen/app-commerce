import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModalSelectClient } from "../components/ModalSelectClient";
import { ModalSelectPriceList } from "../components/ModalSelectPriceList";
import { Client } from "../hooks/queries/useClients";
import { Product } from "../hooks/queries/useProducts";

export type PriceList = {
  codigo: number;
  descricao: string;
};

interface Order {
  period: Period;
  items: [];
}

interface Period {
  period: string;
  name: string;
}

interface Item {
  product: Product;
  qtd: number;
  amount: number;
  total: number;
}

type StoreContextData = {
  client?: Client;
  setClient: (a: Client) => void;
  priceList?: PriceList;
  setPriceList: (a: PriceList) => void;

  items?: Item[];

  onOpenSeleteClient: () => void;
  isOpenSeleteClient: boolean;
  onOpenSeleteListPrice: () => void;
  isOpenSeleteListPrice: boolean;
};

type StoreProviderProps = {
  children: ReactNode;
};

export const pricesList = [
  {
    name: "28 DDL",
    value: 28,
  },
  {
    name: "300 - CARTAO DE CREDITO",
    value: 300,
  },
  {
    name: "42 DDL",
    value: 42,
  },
  {
    name: "56 DDL",
    value: 56,
  },
];

export const StoreContext = createContext({} as StoreContextData);

export function StoreProvider({ children }: StoreProviderProps) {
  const { asPath } = useRouter();

  const {
    isOpen: isOpenSeleteClient,
    onOpen: onOpenSeleteClient,
    onClose: onCloseSeleteClient,
  } = useDisclosure();
  const {
    isOpen: isOpenSeleteListPrice,
    onOpen: onOpenSeleteListPrice,
    onClose: onCloseSeleteListPrice,
  } = useDisclosure();

  const [client, setClient] = useState<Client>({} as Client);
  const [priceList, setPriceList] = useState<PriceList>({} as PriceList);

  useEffect(() => {
    if (asPath === "/pedidos/novo") {
      if (!client?.codigo && !isOpenSeleteClient) onOpenSeleteClient();
      if (!!client?.codigo && !priceList?.codigo && !isOpenSeleteListPrice)
        onOpenSeleteListPrice();
    }
  }, [asPath, client, priceList, isOpenSeleteClient, isOpenSeleteListPrice]);

  return (
    <StoreContext.Provider
      value={{
        client,
        setClient,
        priceList,
        setPriceList,
        onOpenSeleteClient,
        isOpenSeleteClient,
        onOpenSeleteListPrice,
        isOpenSeleteListPrice,
      }}
    >
      {isOpenSeleteClient && (
        <ModalSelectClient
          isOpen={isOpenSeleteClient}
          onClose={onCloseSeleteClient}
          setClient={setClient}
        />
      )}
      {isOpenSeleteListPrice && (
        <ModalSelectPriceList
          isOpen={isOpenSeleteListPrice}
          onClose={onCloseSeleteListPrice}
          setPriceList={setPriceList}
        />
      )}

      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
