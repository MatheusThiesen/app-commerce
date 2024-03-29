import { GetServerSidePropsContext } from "next";
import { useInfiniteQuery, useQuery } from "react-query";
import { mask } from "remask";

import { Product } from "./useProducts";

import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

import { ItemFilter } from "../../@types/api-queries";
import { Client } from "./useClients";

import { BiSolidDiscount } from "react-icons/bi";
import {
  BsCloudSlashFill,
  BsFillCloudArrowUpFill,
  BsFillFileTextFill,
} from "react-icons/bs";
import { FcClock } from "react-icons/fc";
import { HiBadgeCheck } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";
import { Differentiated } from "../../contexts/StoreContext";

export type Order = {
  codigo: number;
  codigoErp: number;
  dataFaturamento: Date;
  dataFaturamentoFormat: string;
  createdAt: Date;
  createdAtFormat: string;
  valorTotal: number;
  valorTotalFormat: string;
  eRascunho: boolean;
  eDiferenciado: boolean;
  tipoDesconto?: "VALOR" | "PERCENTUAL";
  descontoCalculado?: number;
  descontoCalculadoFormat?: string;
  descontoPercentual?: number;
  descontoValor?: number;
  vendedorPendenteDiferenciadoCodigo?: number;
  diferenciados: Differentiated[];
  situacaoPedido?: {
    codigo: number;
    descricao: string;
  };
  vendedores: {
    tipo: number;
    vendedor: {
      codigo: number;
      nome: string;
      nomeGuerra: string;
    };
  }[];
  condicaoPagamento: {
    codigo: number;
    descricao: string;
  };
  cliente: Client;
  periodoEstoque: {
    periodo: string;
    descricao: string;
  };
  tabelaPreco: {
    codigo: number;
    descricao: string;
  };
  itens: Item[];
};

export type Item = {
  codigo: string;
  quantidade: number;
  valorUnitario: number;
  valorUnitarioFormat: string;
  valorTotalFormat: string;
  sequencia: number;
  produto: Product;
};

type OrderApiResponse = {
  data: Order[];
  page: number;
  pagesize: number;
  total: number;
};

type GetOrdersResponse = {
  orders: Order[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetOrdersProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  filters?: ItemFilter[];
  search?: string;
}
type UseOrdersProps = Omit<GetOrdersProps, "page">;

export function selectStatusColor(statusCode?: number): string {
  switch (statusCode) {
    case 1:
      return "yellow.400";
    case 2:
      return "blue.400";
    case 3:
      return "green.400";
    case 4:
      return "red.500";
    case 5:
      return "red.500";
    case 6:
      return "purple.500";
    case 7:
      return "orange.400";
    case 8:
      return "red.500";
    case 99:
      return "orange.400";

    default:
      return "yellow.400";
  }
}

export function selectStatusIcon(statusCode?: number) {
  switch (statusCode) {
    case 1:
      return BsFillCloudArrowUpFill;
    case 2:
      return FcClock;
    case 3:
      return HiBadgeCheck;
    case 4:
      return RiCloseCircleFill;
    case 5:
      return BsCloudSlashFill;
    case 6:
      return BiSolidDiscount;
    case 7:
      return BsFillFileTextFill;
    case 8:
      return RiCloseCircleFill;
    case 99:
      return BsFillFileTextFill;

    default:
      return BsFillCloudArrowUpFill;
  }
}

export async function getOrders({
  page,
  pagesize,
  orderby,
  filters,
  search,
}: GetOrdersProps): Promise<GetOrdersResponse> {
  const { data } = await api.get<OrderApiResponse>("/orders", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetOrdersResponse = {
    orders: data.data.map((order) => ({
      ...order,
      dataFaturamentoFormat: new Date(order.dataFaturamento).toLocaleString(
        "pt-br",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
      createdAtFormat: new Date(order.createdAt).toLocaleString("pt-br", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      cliente: {
        ...order.cliente,
        cnpjFormat: mask(order.cliente.cnpj, "99.999.999/9999-99"),
      },
      valorTotalFormat: order.valorTotal.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getOrderOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Order> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  const { data } = await apiClient.get<Order>(`/orders/${cod}`);

  const order: Order = {
    ...data,
    createdAtFormat: new Date(data.createdAt).toLocaleString("pt-br", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    dataFaturamentoFormat:
      data.periodoEstoque.periodo === "pronta-entrega"
        ? new Date(data.dataFaturamento).toLocaleString("pt-br", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : new Date(data.dataFaturamento).toLocaleString("pt-br", {
            month: "long",
            year: "numeric",
          }),
    cliente: {
      ...data.cliente,
      cepFormat: mask(data.cliente.cep, "99999-999"),
      cnpjFormat: mask(data.cliente.cnpj, "99.999.999/9999-99"),
    },
    valorTotalFormat: data.valorTotal.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    descontoCalculadoFormat: Number(data.descontoCalculado || 0).toLocaleString(
      "pt-br",
      {
        style: "currency",
        currency: "BRL",
      }
    ),
    diferenciados: data.diferenciados.map((differentiated) => ({
      ...differentiated,
      descontoCalculadoFormat: Number(
        differentiated.descontoCalculado || 0
      ).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
    itens: data.itens.map((item) => ({
      ...item,
      valorTotalFormat: (item.valorUnitario * item.quantidade).toLocaleString(
        "pt-br",
        {
          style: "currency",
          currency: "BRL",
        }
      ),
      valorUnitarioFormat: item.valorUnitario.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
  };

  return order;
}

export function useOrders({
  pagesize,
  orderby,
  filters,
  search,
}: UseOrdersProps) {
  return useInfiniteQuery(
    ["orders", pagesize, orderby, filters, search],

    ({ pageParam = 1 }) => {
      return getOrders({
        page: pageParam,
        pagesize,
        orderby,
        filters,
        search,
      });
    },
    {
      // getPreviousPageParam: (firstPage, allPages) => undefined,
      getNextPageParam: (lastPage) => {
        const totalCount = lastPage?.page * lastPage?.pagesize;

        if (totalCount >= lastPage?.total) return undefined;

        return lastPage.page + 2;
      },
    }
  );
}
export function useOrderOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(["order", codigo], () => getOrderOne(codigo, ctx), {});
}
