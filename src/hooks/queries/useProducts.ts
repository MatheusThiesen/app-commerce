import { GetServerSidePropsContext } from "next";
import { useInfiniteQuery, useQuery } from "react-query";
import { mask } from "remask";
import { ItemFilter } from "../../@types/api-queries";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

export type StockLocation = {
  id?: string;
  descricao: string;
  periodo: string;
  quantidade?: number;
};

export type Brand = {
  codigo: number;
  descricao: string;
};

export type Product = {
  codigo: number;
  codigoAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoComplementar: string;
  descricaoAdicional: string;
  ncm: string;
  ncmFormat: string;
  obs: string;
  qtdEmbalagem: number;
  unidade?: {
    unidade: string;
    descricao: string;
  };
  precoVenda: number;
  precoVendaFormat: string;
  precoVendaEmpresa: number;
  precoVendaEmpresaFormat: string;
  precoTabela28?: number;
  precoTabela42?: number;
  precoTabela56?: number;
  precoTabela300?: number;
  precoTabela28Format?: string;
  precoTabela42Format?: string;
  precoTabela56Format?: string;
  precoTabela300Format?: string;
  locaisEstoque?: StockLocation[];
  marca: Brand;
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
  listaPreco?: {
    id: string;
    codigo: number;
    descricao: string;
    valor: number;
    valorFormat: string;
  }[];
  imagens?: {
    nome: string;
  }[];
  imagemPreview?: string;
};

export interface VariationsProduct {
  codigo: number;
  codigoAlternativo: number;
  referencia: string;
  descricao: string;
  imagemPreview: string;

  imagens?: {
    nome: string;
  }[];
}

type ProductApiResponse = {
  data: Product[];
  page: number;
  pagesize: number;
  hasNextPage: boolean;
};

type GetProductsResponse = {
  products: Omit<Product, "variacoes">[];
  page: number;
  pagesize: number;
  hasNextPage: boolean;
};

interface GetProductsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  distinct?: "codigoAlternativo" | "referencia";
  filters?: ItemFilter[];
  isReport?: boolean;
  search?: string;
}

type UseProductsProps = Omit<GetProductsProps, `page`>;

export async function getProducts({
  page,
  pagesize,
  orderby,
  filters,
  distinct,
  isReport = false,
  search,
}: GetProductsProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      distinct,
      isReport: isReport ? 1 : 0,
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
      search,
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
      precoTabela28Format: product?.precoTabela28
        ? product?.precoTabela28.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela42Format: product?.precoTabela42
        ? product?.precoTabela42.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela56Format: product?.precoTabela56
        ? product?.precoTabela56.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela300Format: product?.precoTabela300
        ? product?.precoTabela300.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      listaPreco: product.listaPreco?.map((list) => ({
        ...list,
        valorFormat: list.valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
      })),
    })),
    pagesize: data.pagesize,
    page: data.page,
    hasNextPage: data.hasNextPage,
  };

  return response;
}
export async function getProductOne(
  cod: number,
  clientCod?: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Product | undefined> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  if (cod) {
    const { data } = await apiClient.get<Product>(`/products/${cod}`, {
      params: { clientCod },
    });

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
      listaPreco: data.listaPreco?.map((list) => ({
        ...list,
        valorFormat: list.valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
      })),

      ncmFormat: mask(data.ncm, "9999.99.99"),
    };

    return product;
  }

  return undefined;
}

export function useProducts({
  pagesize,
  orderby,
  filters,
  distinct,
  search,
}: UseProductsProps) {
  return useInfiniteQuery(
    ["products", pagesize, orderby, filters, distinct, search],

    ({ pageParam = 1 }) => {
      return getProducts({
        page: pageParam,
        pagesize,
        orderby,
        filters,
        distinct,
        search,
      });
    },
    {
      // getPreviousPageParam: (firstPage, allPages) => undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNextPage) return undefined;

        return lastPage.page + 2;
      },
    }
  );
}
export function useProductOne(
  codigo: number,
  clientCod?: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(
    ["product", codigo, clientCod],
    () => getProductOne(codigo, clientCod, ctx),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export const productsOrderBy = [
  {
    name: "Maior PDV",
    value: "precoVenda.desc",
  },
  {
    name: "Menor PDV",
    value: "precoVenda.asc",
  },
  {
    name: "Alfabética A>Z",
    value: "descricao.asc",
  },
  {
    name: "Alfabética Z>A",
    value: "descricao.desc",
  },
];
