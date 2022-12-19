import { GetServerSidePropsContext } from "next";
import { useQuery } from "react-query";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

export type Product = {
  codigo: number;
  codigoAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoComplementar: string;
  descricaoAdicional: string;
  precoVenda: number;
  precoVendaFormat: string;
  precoVendaEmpresa: number;
  precoVendaEmpresaFormat: string;
  precoTabela42: number;
  precoTabela42Format: string;
  locaisEstoque?: {
    id: string;
    descricao: string;
    quantidade: number;
  }[];
  marca: {
    codigo: number;
    descricao: string;
  };
  colecao?: {
    codigo: number;
    descricao: string;
  };
  grupo?: {
    codigo: number;
    descricao: string;
  };
  subGrupo?: {
    codigo: number;
    descricao: string;
  };
  genero?: {
    codigo: number;
    descricao: string;
  };
  linha?: {
    codigo: number;
    descricao: string;
  };
  corPrimaria?: {
    codigo: number;
    descricao: string;
  };
  corSecundaria?: {
    cor: {
      codigo: number;
      descricao: string;
    };
  };
  variacoes?: VariationsProduct[];
  grades?: {
    codigo: number;
    descricaoAdicional: string;
  }[];
};

export interface VariationsProduct {
  codigo: number;
  codigoAlternativo: number;
  referencia: string;
  descricao: string;
}

export type FilterList = {
  label: string;
  name: string;
  data: ItemFilter[];
};
export type ItemFilter = {
  name: string;
  value: number | string;
  field: number | string;
};

type ProductApiResponse = {
  data: Product[];
  page: number;
  pagesize: number;
  total: number;
};

type GetProductsResponse = {
  products: Omit<Product, "variacoes">[];
  page: number;
  pagesize: number;
  total: number;
  productsStartShow: number;
  productsEndShow: number;
};

interface UseProductsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  distinct?: "codigoAlternativo" | "referencia";
  filters?: ItemFilter[];
  isReport?: boolean;
}

export async function getProducts({
  page,
  pagesize,
  orderby,
  filters,
  distinct,
  isReport,
}: UseProductsProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      distinct,
      isReport,
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetProductsResponse = {
    products: data.data.map((product) => ({
      ...product,
      precoVendaFormat: product.precoVenda.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
      precoVendaEmpresaFormat: product?.precoVendaEmpresa
        ? product?.precoVendaEmpresa.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ -",
      precoTabela42: product?.precoVendaEmpresa
        ? product.precoVendaEmpresa + product.precoVendaEmpresa * 0.0191
        : 0,
      precoTabela42Format: product?.precoTabela42
        ? product.precoTabela42.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ -",
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
    productsStartShow: data.pagesize * (data.page + 1) - data.pagesize,
    productsEndShow: data.pagesize * (data.page + 1),
  };

  return response;
}

export async function getProductOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Product> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  const { data } = await apiClient.get<Product>(`/products/${cod}`);

  const product: Product = {
    ...data,
    precoVendaFormat: data.precoVenda.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    precoVendaEmpresaFormat: data.precoVendaEmpresa
      ? data.precoVendaEmpresa.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
      : "R$ -",
    precoTabela42: data?.precoVendaEmpresa
      ? data.precoVendaEmpresa + data.precoVendaEmpresa * 0.0191
      : 0,
    precoTabela42Format: data?.precoTabela42
      ? data.precoTabela42.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
      : "R$ -",
  };

  return product;
}

export function useProducts({
  page,
  pagesize,
  orderby,
  filters,
  distinct,
}: UseProductsProps) {
  return useQuery(
    ["products", page, pagesize, orderby, filters, distinct],
    () => getProducts({ page, pagesize, orderby, filters, distinct }),
    {}
  );
}
export function useProductOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(["product", codigo], () => getProductOne(codigo, ctx), {});
}
