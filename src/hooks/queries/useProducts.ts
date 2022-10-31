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
  variacoes?: {
    codigo: number;
    codigoAlternativo: number;
    referencia: string;
    descricao: string;
  }[];
};

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
  filters: FilterList[];
  total: number;
};

type GetProductsResponse = {
  products: Omit<Product, "colecao" | "variacoes">[];
  page: number;
  pagesize: number;
  total: number;
  filters: FilterList[];

  productsStartShow: number;
  productsEndShow: number;
};

interface UseProductsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  filters?: ItemFilter[];
}

export async function getProducts({
  page,
  pagesize,
  orderby,
  filters,
}: UseProductsProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
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
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
    filters: data.filters,
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
  };

  return product;
}

export function useProducts({
  page,
  pagesize,
  orderby,
  filters,
}: UseProductsProps) {
  return useQuery(
    ["products", page, pagesize, orderby, filters],
    () => getProducts({ page, pagesize, orderby, filters }),
    {}
  );
}
export function useProductOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(["product", codigo], () => getProductOne(codigo, ctx), {});
}
