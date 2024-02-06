import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button, Icon, Stack } from "@chakra-ui/react";
import { IoBagHandle } from "react-icons/io5";
import { TbShoppingCartCancel } from "react-icons/tb";
import { ModalAlert } from "../components/ModalAlert";
import { ModalAlertList } from "../components/ModalAlertList";
import { ProductOrder } from "../components/ProductOrder";
import { Client } from "../hooks/queries/useClients";
import { Brand, Product, StockLocation } from "../hooks/queries/useProducts";
import { useLocalStore } from "../hooks/useLocalStore";
import { api } from "../service/apiClient";
import { useAuth } from "./AuthContext";

export type PriceList = {
  codigo: number;
  descricao: string;
};

export type PaymentCondition = {
  codigo: number;
  descricao: string;
};

export type Differentiated = {
  isActive: boolean;

  descontoPercentual?: string;
  descontoValor?: number;
  tipoValor?: "VALOR" | "PERCENTUAL";

  amountDiscount?: number;
  amountDiscountFormat?: string;
};

export interface Order {
  stockLocation: StockLocation;
  brand: Brand;
  differentiated?: Differentiated;
  paymentCondition?: PaymentCondition;
  items: Item[];

  qtd: number;
  amount: number;
  amountFormat: string;
  amountWithDiscount: number;
  amountWithDiscountFormat: string;

  isSketch?: number;
}

interface Item {
  product: Product;
  qtd: number;
  amount: number;
  amountFormat: string;
}

type SketchItem = {
  quantidade: number;
  valorUnitario: number;
  sequencia: number;
  produto: Product;
};

type GetSketchOrderValidResponse = {
  pedido: {
    cliente: Client;
    marca: Brand;
    condicaoPagamento: PaymentCondition;
    periodoEstoque: StockLocation;
    tabelaPreco: PriceList;
  };

  itens: {
    atualizados: SketchItem[];
    deletados: SketchItem[];
    atuais: SketchItem[];
  };
};

type StoreContextData = {
  client?: Client;
  priceList?: PriceList;
  orders: Order[];
  totalItems: number;
  totalAmount: number;
  totalAmountFormat: string;

  validOrders: boolean;

  sketchOrder: (orderCode: number) => Promise<void>;

  addItem: (a: {
    product: Product;
    stockLocation: StockLocation;
    brand: Brand;
    qtd: number;
  }) => void;
  removeItem: (props: {
    productCod: number;
    stockLocationPeriod: string;
    brandCod: number;
  }) => void;
  createOrder: (data: { client: Client; priceList: PriceList }) => void;
  sendOrder: (data: { isDraft: boolean }) => void;
  exitOrder: () => void;
  setPaymentCondition: (d: {
    paymentCondition: PaymentCondition;
    stockLocationPeriod: string;
    brandCod: number;
  }) => void;
  setDifferentiated: (data: {
    order: Order;
    differentiated: Differentiated;
  }) => void;
};

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreContext = createContext({} as StoreContextData);

export function StoreProvider({ children }: StoreProviderProps) {
  const { push } = useRouter();
  const { user } = useAuth();

  const {
    onGet: onGetStoragePriceList,
    onSet: onSetStoragePriceList,
    onRemove: onRemoveStoragePriceList,
  } = useLocalStore("@Order-price-list");
  const {
    onGet: onGetStorageClient,
    onSet: onSetStorageClient,
    onRemove: onRemoveStorageClient,
  } = useLocalStore("@Order-client");
  const {
    onGet: onGetStorageOrder,
    onSet: onSetStorageOrder,
    onRemove: onRemoveStorageOrder,
  } = useLocalStore("@Order-cart");

  const [client, setClient] = useState<Client>({} as Client);
  const [priceList, setPriceList] = useState<PriceList>({} as PriceList);
  const [orders, setOrders] = useState<Order[]>([]);

  const [sketchEditItems, setSketchEditItems] = useState<SketchItem[]>([]);
  const [sketchRemoveItems, setSketchRemoveItems] = useState<SketchItem[]>([]);
  const [isAlertSketch, setIsAlertSketch] = useState<boolean>(false);
  const [isAlertSketchNoItens, setIsAlertSketchNoItens] =
    useState<boolean>(false);

  const totalItems = orders.reduce(
    (previousValue, currentValue) => previousValue + currentValue.items.length,
    0
  );
  const totalAmount = orders.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );
  const totalAmountFormat = totalAmount.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const validOrders =
    orders
      ?.map((order) => (order.paymentCondition ? 1 : 0))
      .filter((f) => f === 1)?.length === orders?.length;

  useEffect(() => {
    const clientStorage = onGetStorageClient();
    const orderStorage = onGetStorageOrder();
    const priceListStorage = onGetStoragePriceList();

    if (clientStorage) setClient(clientStorage);
    if (priceListStorage) setPriceList(priceListStorage);
    if (orderStorage) setOrders(orderStorage ?? []);
  }, []);

  function createOrder({
    client: clientData,
    priceList: priceListData,
  }: {
    client: Client;
    priceList: PriceList;
  }) {
    onSetStoragePriceList(priceListData);
    onSetStorageClient(clientData);
    setClient(clientData);
    setPriceList(priceListData);

    push("/pedidos/novo");
  }

  function exitOrder() {
    push("/pedidos");

    setTimeout(reset, 2000);
  }

  function addItem({
    product,
    qtd,
    stockLocation,
    brand,
  }: {
    product: Product;
    stockLocation: StockLocation;
    brand: Brand;
    qtd: number;
  }): void {
    const getOrders = orders;
    const findStockLocation = getOrders.find(
      (f) =>
        f.stockLocation.periodo === stockLocation.periodo &&
        f.brand?.codigo === brand?.codigo
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

      onSetStorageOrder(getOrders);
      setOrders(getOrders);
    } else {
      const orderCreate: Order = {
        stockLocation: {
          descricao: stockLocation.descricao,
          periodo: stockLocation.periodo,
        },
        brand: brand,
        qtd: qtd,
        amount,
        amountFormat,
        amountWithDiscount: 0,
        amountWithDiscountFormat: "R$ 0,00",
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
      onSetStorageOrder([...orders, orderCreate]);
    }

    recalculatePriceOrders();
  }

  function removeItem({
    productCod,
    stockLocationPeriod,
    brandCod,
  }: {
    productCod: number;
    brandCod: number;
    stockLocationPeriod: string;
  }) {
    const findOrder = orders.find(
      (f) =>
        f.stockLocation.periodo === stockLocationPeriod &&
        f.brand.codigo === brandCod
    );

    if (!findOrder) throw new Error("Order not found");

    if (findOrder.items.length === 1) {
      onSetStorageOrder(orders.filter((f) => f !== findOrder));
      setOrders((oldOrder) => oldOrder.filter((f) => f !== findOrder));

      return recalculatePriceOrders();
    }

    onSetStorageOrder(
      orders.filter((order) =>
        order === findOrder
          ? {
              ...order,
              items: order.items.filter((f) => f.product.codigo !== productCod),
            }
          : order
      )
    );
    setOrders((oldOrder) =>
      oldOrder.map((order) =>
        order === findOrder
          ? {
              ...order,
              items: order.items.filter((f) => f.product.codigo !== productCod),
            }
          : order
      )
    );

    return recalculatePriceOrders();
  }

  function recalculatePriceOrders() {
    setOrders((oldOrder) =>
      oldOrder.map((order) => ({
        ...order,
        amount: order.items.reduce(
          (previousValue, currentValue) => previousValue + currentValue.amount,
          0
        ),
        amountFormat: order.items
          .reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.amount,
            0
          )
          .toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          }),
      }))
    );
  }

  function reset() {
    onRemoveStoragePriceList();
    onRemoveStorageClient();
    onRemoveStorageOrder();

    setOrders([]);
    setClient({} as Client);
    setPriceList({} as PriceList);
  }

  function setPaymentCondition({
    brandCod,
    paymentCondition,
    stockLocationPeriod,
  }: {
    paymentCondition: PaymentCondition;
    stockLocationPeriod: string;
    brandCod: number;
  }) {
    onSetStorageOrder(
      orders.map((order) => {
        if (
          order.stockLocation.periodo === stockLocationPeriod &&
          order.brand.codigo === brandCod
        ) {
          return { ...order, paymentCondition };
        }
        return order;
      })
    );

    setOrders((prev) =>
      prev.map((order) => {
        if (
          order.stockLocation.periodo === stockLocationPeriod &&
          order.brand.codigo === brandCod
        ) {
          return { ...order, paymentCondition };
        }

        return order;
      })
    );
  }

  function setDifferentiated({
    differentiated,
    order,
  }: {
    order: Order;
    differentiated: Differentiated;
  }) {
    console.log(differentiated);

    const ordersUpdated = orders.map((old) => {
      if (order === old) {
        const amountDiscount =
          Number(order.differentiated?.amountDiscount) ?? 0;

        const amountWithDiscount = order.amount - amountDiscount;
        const amountWithDiscountFormat = amountWithDiscount.toLocaleString(
          "pt-br",
          {
            style: "currency",
            currency: "BRL",
          }
        );

        return {
          ...old,
          amountWithDiscount,
          amountWithDiscountFormat,
          differentiated,
        };
      }

      return old;
    });

    setOrders(ordersUpdated);
    onSetStorageOrder(ordersUpdated);
  }

  async function sketchOrder(orderCode: number) {
    //Lista de produto que sofreram alterações;
    const getSketch = await api.post<GetSketchOrderValidResponse>(
      `/orders/sketch/${orderCode}`
    );

    if (!getSketch) throw new Error();

    const { pedido, itens } = getSketch.data;

    if (itens.atuais.length <= 0) {
      return setIsAlertSketchNoItens(true);
    }

    onSetStoragePriceList(pedido.tabelaPreco);
    onSetStorageClient(pedido.cliente);
    setClient(pedido.cliente);
    setPriceList(pedido.tabelaPreco);

    const amountOrder = itens.atuais.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.valorUnitario,
      0
    );
    const amountOrderFormat = amountOrder.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    const amountWithDiscount = 0;
    const amountWithDiscountFormat = amountWithDiscount.toLocaleString(
      "pt-br",
      {
        style: "currency",
        currency: "BRL",
      }
    );

    const orderCreate: Order = {
      paymentCondition: pedido.condicaoPagamento,
      stockLocation: {
        descricao: pedido.periodoEstoque.descricao,
        periodo: pedido.periodoEstoque.periodo,
      },
      brand: {
        codigo: pedido.marca.codigo,
        descricao: pedido.marca.descricao,
      },
      qtd: itens.atuais.length,
      amount: amountOrder,
      amountFormat: amountOrderFormat,
      amountWithDiscount,
      amountWithDiscountFormat,
      isSketch: orderCode,
      items: itens.atuais.map((item) => {
        const amount = Number(item.valorUnitario) * item.quantidade;
        const amountFormat = amount.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });

        return {
          qtd: item.quantidade,
          product: item.produto,
          amount,
          amountFormat: amountFormat,
        };
      }),
    };

    setOrders([orderCreate]);
    recalculatePriceOrders();

    if (itens.atualizados.length <= 0 && itens.deletados.length <= 0) {
      push("/pedidos/novo");
    } else {
      setSketchEditItems(itens.atualizados);
      setSketchRemoveItems(itens.deletados);
      setIsAlertSketch(true);
    }
  }

  async function handleRedirectSketch() {
    setSketchEditItems([]);
    setSketchRemoveItems([]);
    setIsAlertSketch(false);

    push("/pedidos/novo");
  }

  async function sendOrder({ isDraft }: { isDraft: boolean }) {
    for (const order of orders) {
      if (!!order.isSketch) {
        await api.put(`/orders/${order.isSketch}`, {
          vendedorCodigo: user?.vendedorCodigo,
          clienteCodigo: client.codigo,
          condicaoPagamentoCodigo: order.paymentCondition?.codigo,
          tabelaPrecoCodigo: priceList.codigo,
          marcaCodigo: order.brand.codigo,
          periodoEstoque: order.stockLocation.periodo,
          eRascunho: isDraft,
          rascunhoCodigo: order.isSketch,
          itens: order.items.map((item) => {
            const findPriceList = item?.product.listaPreco?.find(
              (f) => Number(f.codigo) === Number(priceList?.codigo)
            );

            const amount = findPriceList?.valor
              ? findPriceList?.valor
              : item.qtd / item.amount;

            return {
              produtoCodigo: item.product.codigo,
              quantidade: item.qtd,
              valorUnitario: amount,
            };
          }),
        });
      } else {
        await api.post("/orders", {
          vendedorCodigo: user?.vendedorCodigo,
          clienteCodigo: client.codigo,
          condicaoPagamentoCodigo: order.paymentCondition?.codigo,
          tabelaPrecoCodigo: priceList.codigo,
          marcaCodigo: order.brand.codigo,
          periodoEstoque: order.stockLocation.periodo,
          eRascunho: isDraft,
          rascunhoCodigo: order.isSketch,
          itens: order.items.map((item) => {
            const findPriceList = item?.product.listaPreco?.find(
              (f) => Number(f.codigo) === Number(priceList?.codigo)
            );

            const amount = findPriceList?.valor
              ? findPriceList?.valor
              : item.qtd / item.amount;

            return {
              produtoCodigo: item.product.codigo,
              quantidade: item.qtd,
              valorUnitario: amount,
            };
          }),
        });
      }
    }

    push("/pedidos");
    setTimeout(reset, 2000);
  }

  return (
    <StoreContext.Provider
      value={{
        client,
        priceList,
        orders,
        totalItems,
        totalAmount,
        totalAmountFormat,
        validOrders,
        addItem,
        sendOrder,
        createOrder,
        exitOrder,
        removeItem,
        setPaymentCondition,
        setDifferentiated,
        sketchOrder,
      }}
    >
      {isAlertSketch && (
        <ModalAlertList
          isOpen={isAlertSketch}
          onClose={handleRedirectSketch}
          title="Lista de produto que sofreram alterações"
        >
          <Stack py="4" px="4">
            {sketchEditItems.map((item) => {
              const unitAmount = item.valorUnitario;
              const unitAmountFormat = unitAmount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });
              const amount = item.valorUnitario * item.quantidade;
              const amountFormat = amount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });

              return (
                <ProductOrder
                  key={item.produto.codigo}
                  product={item.produto}
                  amount={amountFormat}
                  qtd={item.quantidade}
                  unitAmount={unitAmountFormat}
                  isChange
                />
              );
            })}

            {sketchRemoveItems.map((item) => {
              const unitAmount = item.valorUnitario;
              const amount = item.valorUnitario * item.quantidade;
              const unitAmountFormat = unitAmount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });
              const amountFormat = amount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });

              return (
                <ProductOrder
                  key={item.produto.codigo}
                  product={item.produto}
                  amount={amountFormat}
                  qtd={item.quantidade}
                  unitAmount={unitAmountFormat}
                  isTrash
                />
              );
            })}

            <Button
              onClick={handleRedirectSketch}
              type="button"
              colorScheme="blue"
              leftIcon={<Icon as={IoBagHandle} type="button" />}
            >
              DIGITAR
            </Button>
          </Stack>
        </ModalAlertList>
      )}

      {isAlertSketchNoItens && (
        <ModalAlert
          isOpen={isAlertSketchNoItens}
          onClose={() => {
            setIsAlertSketchNoItens(false);
          }}
          data={{
            Icon: TbShoppingCartCancel,
            title: "Sem produtos disponíveis.",
          }}
        />
      )}
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
