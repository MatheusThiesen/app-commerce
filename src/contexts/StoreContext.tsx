import { Button, Icon, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { differenceInDays } from "date-fns";
import { mask } from "remask";
import { api } from "../service/apiClient";

import { IoBagHandle } from "react-icons/io5";
import { TbShoppingCartCancel } from "react-icons/tb";

import { ModalAlert } from "../components/ModalAlert";
import { ModalAlertList } from "../components/ModalAlertList";
import { ProductOrder } from "../components/ProductOrder";

import { Client } from "../hooks/queries/useClients";
import { Brand, Product, StockLocation } from "../hooks/queries/useProducts";
import { useLocalStore } from "../hooks/useLocalStore";
import { useAuth } from "./AuthContext";

export type PriceList = {
  codigo: number;
  descricao: string;
};

export type PaymentCondition = {
  codigo: number;
  descricao: string;
  totalValue: number;
  totalValueFormat: string;
  priceList: number;
};

export type Differentiated = {
  isActive: boolean;

  descontoPercentual?: string;
  descontoValor?: number;
  tipoDesconto?: "VALOR" | "PERCENTUAL";

  motivoDiferenciado?: string;

  amountDiscount?: number;
  amountDiscountFormat?: string;

  id?: string;
  vendedor?: {
    codigo: number;
    nome: string;
    nomeGuerra: string;
  };
  passo?: number;
  descontoCalculado?: number;
  eFinalizado?: boolean;
  eAprovado?: boolean;
  descontoCalculadoFormat?: string;
  tipoUsuario?: string;

  createdAt?: Date;
  updatedAt?: Date;
};

export interface Order {
  createdAt: Date;

  stockLocation: StockLocation;
  brand: Brand;
  differentiated?: Differentiated;
  paymentCondition?: PaymentCondition;
  items: Item[];
  diferenciado?: Differentiated;

  qtd: number;
  netAmount: number;
  netAmountFormat: string;
  amount: number;
  amountFormat: string;
  isSketch?: number;
  isCreatedByClient?: boolean;
}

interface Item {
  product: Product;
  qtd: number;
  amount: number;
  amountFormat: string;
}

export type SketchItem = {
  quantidade: number;
  valorUnitario: number;
  sequencia: number;
  produto: Product;
};

export type GetSketchOrderValidResponse = {
  pedido: {
    eCriadoPeloCliente: boolean;
    cliente: Client;
    marca: Brand;
    condicaoPagamento: PaymentCondition;
    periodoEstoque: StockLocation;
    tabelaPreco: PriceList;
    diferenciado?: Differentiated;
  };

  itens: {
    atualizados: SketchItem[];
    deletados: SketchItem[];
    atuais: SketchItem[];
  };
};

type StoreContextData = {
  client?: Client;
  priceList: PriceList;
  orders: Order[];
  totalItems: number;
  totalAmount: number;
  totalAmountFormat: string;
  totalNetAmount: number;
  totalNetAmountFormat: string;

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
  sendOrder: (data: { isDraft: boolean }) => Promise<void>;
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
  changePriceList: (p: PriceList) => void;
};

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreContext = createContext({} as StoreContextData);

export function StoreProvider({ children }: StoreProviderProps) {
  const { push } = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const { onGet: onGetStoragePriceList, onSet: onSetStoragePriceList } =
    useLocalStore<PriceList>("@Order-price-list");
  const {
    onGet: onGetStorageClient,
    onSet: onSetStorageClient,
    onRemove: onRemoveStorageClient,
  } = useLocalStore<Client>("@Order-client");
  const {
    onGet: onGetStorageOrder,
    onSet: onSetStorageOrder,
    onRemove: onRemoveStorageOrder,
  } = useLocalStore<Order[]>("@Order-cart");

  const [client, setClient] = useState<Client>({} as Client);
  const [priceList, setPriceList] = useState<PriceList>({
    codigo: 28,
    descricao: "28 DDL",
  } as PriceList);
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
    (previousValue, currentValue) =>
      previousValue +
      (currentValue.amount -
        (currentValue.differentiated?.amountDiscount ?? 0)),
    0
  );
  const totalAmountFormat = totalAmount.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  const totalNetAmount = orders.reduce(
    (previousValue, currentValue) =>
      previousValue +
      (currentValue.netAmount -
        (currentValue.differentiated?.amountDiscount ?? 0)),
    0
  );
  const totalNetAmountFormat = totalNetAmount.toLocaleString("pt-br", {
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
    if (orderStorage) {
      setOrders(
        orderStorage.filter((f) => {
          const differenceDays = differenceInDays(new Date(), f.createdAt);

          return differenceDays <= 2;
        }) ?? []
      );
    }
  }, []);

  useEffect(() => {
    if (user.eCliente) {
      const clientNormalized = {
        ...user.cliente,
        cepFormat: mask(user.cliente.cep, "99999-999"),
        cnpjFormat: mask(user.cliente.cnpj, "99.999.999/9999-99"),
        telefone2Format: user.cliente.telefone2
          ? mask(user.cliente.telefone2, [
              "9999-9999",
              "99999-9999",
              "(99) 9999-9999",
              "(99) 99999-9999",
            ])
          : undefined,
        telefoneFormat: user.cliente.telefone
          ? mask(user.cliente.telefone, [
              "9999-9999",
              "99999-9999",
              "(99) 9999-9999",
              "(99) 99999-9999",
            ])
          : undefined,
      };

      onSetStoragePriceList({ codigo: 28, descricao: "28 DDL" });
      onSetStorageClient(clientNormalized);
      setClient(clientNormalized);
    }
  }, [user]);

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

    setTimeout(reset, 1000);
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
        createdAt: new Date(),
        stockLocation: {
          descricao: stockLocation.descricao,
          periodo: stockLocation.periodo,
        },
        brand: brand,
        qtd: qtd,
        netAmount: amount,
        netAmountFormat: amountFormat,
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
        netAmount: order.items.reduce(
          (previousValue, currentValue) => previousValue + currentValue.amount,
          0
        ),
        netAmountFormat: order.items
          .reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.amount,
            0
          )
          .toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          }),
        amount: order.items.reduce(
          (previousValue, currentValue) => previousValue + currentValue.amount,
          order.paymentCondition?.totalValue ?? 0
        ),
        amountFormat: order.items
          .reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.amount,
            order.paymentCondition?.totalValue ?? 0
          )
          .toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          }),
      }))
    );
  }

  function reset() {
    onRemoveStorageOrder();
    setOrders([]);

    if (!user.eCliente) {
      onRemoveStorageClient();
      setClient({} as Client);
    }
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
    const setPaymentConditionInOrder = orders.map((order) => {
      if (
        order.stockLocation.periodo === stockLocationPeriod &&
        order.brand.codigo === brandCod
      ) {
        return { ...order, paymentCondition };
      }
      return order;
    });

    onSetStorageOrder(setPaymentConditionInOrder);
    setOrders(setPaymentConditionInOrder);
    recalculatePriceOrders();
  }

  function setDifferentiated({
    differentiated,
    order,
  }: {
    order: Order;
    differentiated: Differentiated;
  }) {
    const ordersUpdated = orders.map((old) => {
      if (order.stockLocation.periodo === old.stockLocation.periodo) {
        return {
          ...old,
          differentiated,
        };
      }

      return old;
    });

    setOrders(ordersUpdated);
    onSetStorageOrder(ordersUpdated);
  }

  function normalizedDifferentiated(
    differentiated: Differentiated
  ): Differentiated {
    let normalized: Differentiated = {
      isActive: true,
      tipoDesconto: differentiated.tipoDesconto,
      descontoValor: differentiated.descontoValor,
      descontoPercentual: differentiated.descontoPercentual,
      motivoDiferenciado: differentiated.motivoDiferenciado,

      amountDiscount: differentiated.descontoCalculado,
      amountDiscountFormat: Number(
        differentiated.descontoCalculado
      ).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    };

    return normalized;
  }

  async function sketchOrder(orderCode: number) {
    const getSketch = await api.post<GetSketchOrderValidResponse>(
      `/orders/sketch/${orderCode}`
    );

    if (!getSketch) throw new Error();

    const { pedido, itens } = getSketch.data;

    if (itens.atuais.length <= 0) {
      return setIsAlertSketchNoItens(true);
    }

    onSetStoragePriceList(pedido.tabelaPreco);
    onSetStorageClient({
      ...pedido.cliente,
      cepFormat: mask(pedido.cliente.cep, "99999-999"),
      cnpjFormat: mask(pedido.cliente.cnpj, "99.999.999/9999-99"),
    });
    setClient({
      ...pedido.cliente,
      cepFormat: mask(pedido.cliente.cep, "99999-999"),
      cnpjFormat: mask(pedido.cliente.cnpj, "99.999.999/9999-99"),
    });
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

    const orderCreate: Order = {
      createdAt: new Date(),
      paymentCondition: {
        ...pedido.condicaoPagamento,
        priceList: pedido.tabelaPreco.codigo,
      },
      stockLocation: {
        descricao: pedido.periodoEstoque.descricao,
        periodo: pedido.periodoEstoque.periodo,
      },
      brand: {
        codigo: pedido.marca.codigo,
        descricao: pedido.marca.descricao,
      },
      differentiated: pedido.diferenciado
        ? normalizedDifferentiated(pedido.diferenciado)
        : undefined,
      qtd: itens.atuais.length,
      amount: amountOrder,
      amountFormat: amountOrderFormat,
      netAmount: amountOrder,
      netAmountFormat: amountOrderFormat,
      isSketch: orderCode,
      isCreatedByClient: pedido.eCriadoPeloCliente,
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
      if (user.eCliente) {
        push("/produtos");
      } else {
        push("/pedidos/novo");
      }
    } else {
      setSketchEditItems(itens.atualizados);
      setSketchRemoveItems(itens.deletados);
      setIsAlertSketch(true);
    }
  }

  async function sendOrder({ isDraft }: { isDraft: boolean }) {
    for (const order of orders) {
      const priceListNormalized =
        order.paymentCondition?.priceList === priceList.codigo
          ? priceList.codigo
          : order.paymentCondition?.priceList;

      const orderNormalized = {
        vendedorCodigo: user?.vendedorCodigo,
        clienteCodigo: client.codigo,
        condicaoPagamentoCodigo: order.paymentCondition?.codigo,
        tabelaPrecoCodigo: priceListNormalized,
        marcaCodigo: order.brand.codigo,
        periodoEstoque: order.stockLocation.periodo,
        rascunhoCodigo: order.isSketch,
        eRascunho: isDraft,
        eDiferenciado: !!order.differentiated?.isActive,
        tipoDesconto: order.differentiated?.tipoDesconto,
        descontoPercentual: order.differentiated?.descontoPercentual
          ? Number(order.differentiated?.descontoPercentual)
          : undefined,
        descontoValor: order.differentiated?.descontoValor,
        motivoDiferenciado: order.differentiated?.motivoDiferenciado,
        descontoCalculado: order.differentiated?.amountDiscount,
        itens: order.items.map((item) => {
          const findPriceList = item?.product.listaPreco?.find(
            (f) => Number(f.codigo) === Number(priceListNormalized)
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
      };

      if (!!order.isSketch) {
        await api.put(`/orders/${order.isSketch}`, orderNormalized);
      } else {
        await api.post("/orders", orderNormalized);
      }
    }

    push("/pedidos");
    setTimeout(reset, 2000);
    toast({
      title: "Enviado pedido",
      description: "Seu pedido foi realizado com sucesso.",
      status: "success",
      isClosable: true,
      position: "top",
    });
  }

  async function handleRedirectSketch() {
    setSketchEditItems([]);
    setSketchRemoveItems([]);
    setIsAlertSketch(false);

    push("/pedidos/novo");
  }

  async function changePriceList(priceList: PriceList) {
    const removePaymentConditionOrders = orders.map((order) => ({
      ...order,
      paymentCondition: undefined,
    }));

    setOrders(removePaymentConditionOrders);
    onSetStorageOrder(removePaymentConditionOrders);

    onSetStoragePriceList(priceList);
    setPriceList(priceList);
    recalculatePriceOrders();
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
        totalNetAmount,
        totalNetAmountFormat,
        validOrders,

        addItem,
        sendOrder,
        createOrder,
        exitOrder,
        removeItem,
        setPaymentCondition,
        setDifferentiated,
        sketchOrder,
        changePriceList,
      }}
    >
      {isAlertSketch && (
        <ModalAlertList
          isOpen={isAlertSketch}
          onClose={() => setIsAlertSketch(false)}
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
