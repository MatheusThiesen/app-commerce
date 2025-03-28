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
import { FaBusinessTime } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import { HiBadgeCheck } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";
import { TbAlertSquareFilled } from "react-icons/tb";
import { Differentiated } from "../../contexts/StoreContext";

const TYPE_SELLER_NORMALIZED = {
  DIRETOR: "DIRETOR",
  GERENTE: "GERENTE NACIONAL",
  SUPERVISOR: "GERENTE REGIONAL",
  VENDEDOR: "REPRESENTANTE",
};

export type Order = {
  codigo: number;
  codigoErp: number;
  dataFaturamento: Date;
  dataFaturamentoFormat: string;
  createdAt: Date;
  createdAtFormat: string;
  valorTotal: number;
  valorTotalFormat: string;
  valorTotalCusto: number;
  eRascunho: boolean;
  ePendente: boolean;
  eDiferenciado: boolean;
  tipoDesconto?: "VALOR" | "PERCENTUAL";
  descontoCalculado?: number;
  descontoCalculadoFormat?: string;
  cancelamentoValor?: number;
  cancelamentoValorFormat?: string;
  descontoPercentual?: number;
  descontoValor?: number;
  descontoValorFormat: string;
  vendedorPendenteDiferenciadoCodigo?: number;
  diferenciados: Differentiated[];
  situacaoPedido?: {
    codigo: number;
    descricao: string;
  };
  vendedorPendenteDiferenciado?: {
    codigo: number;
    nome: string;
    nomeGuerra: string;
    tipoVendedor: string;
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
  pedidoErp?: {
    dataFaturamento: Date;
    valorTotal: number;
    valorTotalFormat?: string;
  };
  itens: ItemOrder[];
};

export type ItemOrder = {
  codigo: string;
  quantidade: number;
  valorUnitario: number;
  valorUnitarioFormat: string;
  valorTotalFormat: string;
  sequencia: number;
  produto: Product;

  itemErp?: {
    quantidade: number;
    valorUnitario: number;
    valorTotalFormat: string;
    situacao: string;

    motivoRecusa?: {
      codigo: number;
      descricao: string;
    };
    motivoCancelamento?: {
      codigo: number;
      descricao: string;
    };
  };
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
    case 9:
      return "purple.500";
    case 10:
      return "purple.500";
    case 11:
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
    case 9:
      return TbAlertSquareFilled;
    case 10:
      return FaBusinessTime;
    case 11:
      return RiCloseCircleFill;
    case 99:
      return BsFillFileTextFill;

    default:
      return BsFillCloudArrowUpFill;
  }
}

export const orderStatusStyle = {
  1: { textColor: "text-yellow-600", bgColor: "bg-yellow-600" },
  2: { textColor: "text-blue-600", bgColor: "bg-blue-700" },
  3: { textColor: "text-green-600", bgColor: "bg-green-600" },
  4: { textColor: "text-red-600", bgColor: "bg-red-600" },
  5: { textColor: "text-red-600", bgColor: "bg-red-600" },
  6: { textColor: "text-purple-500", bgColor: "bg-purple-500" },
  7: { textColor: "text-orange-500", bgColor: "bg-orange-500" },
  8: { textColor: "text-red-600", bgColor: "bg-red-600" },
  9: { textColor: "text-purple-500", bgColor: "bg-purple-500" },
  10: { textColor: "text-purple-500", bgColor: "bg-purple-500" },
  11: { textColor: "text-red-600", bgColor: "bg-red-600" },
};

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
        hour: "2-digit",
        minute: "2-digit",
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

  const cancelamentoValor = data.itens.reduce(
    (previousValue, currentValue) =>
      currentValue?.itemErp?.situacao === "Cancelado"
        ? currentValue?.itemErp?.valorUnitario *
            currentValue?.itemErp?.quantidade +
          previousValue
        : previousValue,
    0
  );

  const descontoCalculado =
    data.valorTotal - (data.descontoCalculado ?? 0) - cancelamentoValor;

  const order: Order = {
    ...data,

    pedidoErp: data.pedidoErp
      ? {
          ...data.pedidoErp,
          valorTotalFormat: data.pedidoErp?.valorTotal?.toLocaleString(
            "pt-br",
            {
              style: "currency",
              currency: "BRL",
            }
          ),
        }
      : undefined,

    createdAtFormat: new Date(data.createdAt).toLocaleString("pt-br", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    descontoCalculado: descontoCalculado,
    descontoCalculadoFormat: descontoCalculado.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    descontoValor: data.descontoCalculado ?? 0,
    descontoValorFormat: Number(data?.descontoCalculado ?? 0).toLocaleString(
      "pt-br",
      {
        style: "currency",
        currency: "BRL",
      }
    ),
    cancelamentoValor: cancelamentoValor,
    cancelamentoValorFormat: Number(cancelamentoValor).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
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
    valorTotalCusto: data.itens.reduce(
      (previousValue, current) =>
        current.quantidade * current.produto.precoVendaEmpresa + previousValue,
      0
    ),
    valorTotalFormat: data.valorTotal.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),

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
      itemErp: item.itemErp
        ? {
            ...item.itemErp,
            valorTotalFormat: (
              item.itemErp.valorUnitario * item.itemErp.quantidade
            ).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            }),
          }
        : undefined,
    })),
    vendedorPendenteDiferenciado: data.vendedorPendenteDiferenciado
      ? {
          ...data.vendedorPendenteDiferenciado,
          tipoVendedor:
            TYPE_SELLER_NORMALIZED?.[
              data.vendedorPendenteDiferenciado.tipoVendedor as
                | "DIRETOR"
                | "GERENTE"
                | "SUPERVISOR"
                | "VENDEDOR"
            ],
        }
      : undefined,
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
