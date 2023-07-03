import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
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
  priceList?: PriceList;
  orders: Order[];
  totalItems: number;

  addItem: (a: {
    product: Product;
    stockLocation: StockLocation;
    qtd: number;
  }) => void;
  reset: () => void;
  getStockProduct: (props: {
    product: Product;
    stockLocationPeriod: string;
  }) => number;
  createOrder: () => void;
  exitOrder: () => void;
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
  const { pathname, push } = useRouter();
  const { "order-client": orderClient, "order-price-list": orderPriceList } =
    parseCookies();

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

  const [client, setClient] = useState<Client | undefined>(undefined);
  const [priceList, setPriceList] = useState<PriceList | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);

  const totalItems = orders.reduce(
    (previousValue, currentValue) => previousValue + currentValue.items.length,
    0
  );

  useEffect(() => {
    if (orderClient) setClient(JSON.parse(orderClient));
    if (orderPriceList) setPriceList(JSON.parse(orderPriceList));
  }, []);

  useEffect(() => {
    if (!!orderPriceList && !!orderClient) {
      onCloseSeleteClient();
      onCloseSeleteListPrice();
    } else {
      if (
        ["/pedidos/novo/produtos/[codigo]", "/pedidos/novo"].includes(pathname)
      ) {
        if (!client?.codigo && !isOpenSeleteClient) onOpenSeleteClient();
        if (!!client?.codigo && !priceList?.codigo && !isOpenSeleteListPrice)
          onOpenSeleteListPrice();
      } else {
        onCloseSeleteClient();
        onCloseSeleteListPrice();
      }
    }
  }, [pathname, client, priceList, isOpenSeleteClient, isOpenSeleteListPrice]);

  function createOrder() {
    push("/pedidos/novo");
  }
  function exitOrder() {
    push("/pedidos");

    setTimeout(reset, 1000);
  }

  function getStockProduct({
    product,
    stockLocationPeriod,
  }: {
    product: Product;
    stockLocationPeriod: string;
  }) {
    return (
      product.locaisEstoque?.find((f) => f.periodo === stockLocationPeriod)
        ?.quantidade ?? 0
    );
  }

  function addItem({
    product,
    qtd,
    stockLocation,
  }: {
    product: Product;
    stockLocation: StockLocation;
    qtd: number;
  }): void {
    const getOrders = orders;
    const findStockLocation = getOrders.find(
      (order) => order.stockLocation.periodo === stockLocation.periodo
    );

    const findPriceList = product?.listaPreco?.find(
      (f) => Number(f.codigo) === Number(priceList?.codigo)
    );
    const amount = Number(findPriceList?.valor) * qtd;
    const amountFormat = amount.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    if (findStockLocation) {
      findStockLocation.amount += amount;
      findStockLocation.amountFormat = findStockLocation.amount.toLocaleString(
        "pt-br",
        {
          style: "currency",
          currency: "BRL",
        }
      );

      const findItem = findStockLocation.items.find(
        (i) => i.product.codigo === product.codigo
      );

      if (findItem) {
        findItem.product = product;
        findItem.amount = amount;
        findItem.amountFormat = amountFormat;
        findItem.qtd = qtd;
      } else {
        findStockLocation.items.push({
          product,
          amount,
          amountFormat,
          qtd,
        });
      }

      setOrders(getOrders);
    } else {
      const orderCreate: Order = {
        stockLocation: {
          descricao: stockLocation.descricao,
          periodo: stockLocation.periodo,
        },
        qtd: qtd,
        amount,
        amountFormat,
        items: [
          {
            product,
            amount,
            amountFormat,
            qtd,
          },
        ],
      };

      setOrders((oldData) => [...oldData, orderCreate]);
    }
  }

  function reset() {
    destroyCookie(undefined, "order-client");
    destroyCookie(undefined, "order-price-list");
    setOrders([]);
    setClient(undefined);
    setPriceList(undefined);
  }

  function handleSetClient(clientData: Client) {
    setClient(clientData);
    setCookie(undefined, "order-client", JSON.stringify(clientData));
  }
  function handleSetPriceList(priceListData: PriceList) {
    setPriceList(priceListData);
    setCookie(undefined, "order-price-list", JSON.stringify(priceListData));
  }

  return (
    <StoreContext.Provider
      value={{
        client,
        priceList,
        addItem,
        reset,
        orders,
        totalItems,
        getStockProduct,
        createOrder,
        exitOrder,
      }}
    >
      {isOpenSeleteClient && (
        <ModalSelectClient
          isOpen={isOpenSeleteClient}
          onClose={onCloseSeleteClient}
          setClient={handleSetClient}
        />
      )}
      {isOpenSeleteListPrice && (
        <ModalSelectPriceList
          isOpen={isOpenSeleteListPrice}
          onClose={onCloseSeleteListPrice}
          setPriceList={handleSetPriceList}
        />
      )}

      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
