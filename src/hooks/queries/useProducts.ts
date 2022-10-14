import { GetServerSidePropsContext } from "next";
import { useQuery } from "react-query";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

export type Product = {
  codigo: number;
  codigoAlternativo: string;
  referencia: string;
  descricao: string;
  precoVenda: number;
  precoVendaFormat: string;
  marca: {
    codigo: number;
    descricao: string;
  };
  colecao: {
    codigo: number;
    descricao: string;
  };
};

export type FilterList = {
  label: string;
  name: string;
  data: ItemFilter[];
};
type ItemFilter = {
  name: string;
  value: number | string;
};

type ProductApiResponse = {
  data: Product[];
  page: number;
  pagesize: number;
  filters: FilterList[];
  total: number;
};

type GetProductsResponse = {
  products: Omit<Product, "colecao">[];
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
}

async function getProducts({
  page,
  pagesize,
  orderby,
}: UseProductsProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
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

export function useProducts({ page, pagesize, orderby }: UseProductsProps) {
  return useQuery(
    ["products", page, pagesize, orderby],
    () => getProducts({ page, pagesize, orderby }),
    {}
  );
}
export function useProductOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(["product", codigo], () => getProductOne(codigo, ctx), {});
}
