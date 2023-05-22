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
import { Product, StockLocation } from "../hooks/queries/useProducts";

export type PriceList = {
  codigo: number;
  descricao: string;
};

interface Order {
  stockLocation: StockLocation;
  items: Item[];

  qtd: number;
  amount: number;
  amountFormat: string;
}

interface Item {
  product: Product;
  qtd: number;
  amount: number;
  amountFormat: string;
}

type StoreContextData = {
  client?: Client;
  setClient: (a: Client) => void;
  priceList?: PriceList;
  setPriceList: (a: PriceList) => void;

  orders?: Order[];
  totalItems?: number;

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
  const [orders, setOrders] = useState<Order>({} as Order);

  useEffect(() => {
    if (asPath === "/pedidos/novo") {
      if (!client?.codigo && !isOpenSeleteClient) onOpenSeleteClient();
      if (!!client?.codigo && !priceList?.codigo && !isOpenSeleteListPrice)
        onOpenSeleteListPrice();
    }
  }, [asPath, client, priceList, isOpenSeleteClient, isOpenSeleteListPrice]);

  function handleGetStockProduct(
    product: Product,
    stockLocation: StockLocation
  ) {}

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
