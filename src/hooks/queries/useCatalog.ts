import { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";
import { api } from "../../service/apiClient";

export type getCatalogProps = {
  id?: string;
  page: number;
  pagesize?: number;
};

export type UseCatalogProps = Omit<getCatalogProps, `page`>;

export type CatalogApiResponse = {
  products: ProductPage[];
  date: Date;
  dateToString: string;
  page: number;
  pagesize: number;
  total: number;

  isError?: boolean;
  error?: string;
};

export type ProductPage = {
  imageMain: string;
  reference: string;
  description: string;
  descriptionAdditional: string;
  alternativeCode: string;
  colors: string;
  price: string;
  brand: string;
  colection: string;
  genre: string;
  group: string;
  subgroup: string;
  line: string;
  grids: {
    name: string;
    stocks?: {
      description: string;
      qtd: number;
    }[];
  }[];

  isGroupProduct: boolean;
  isStockLocation: boolean;
  variations?: {
    imageMain: string;
    reference: string;
  }[];
};

export async function getCatalog({ id, page, pagesize }: getCatalogProps) {
  try {
    const { data } = await api.get<CatalogApiResponse>(
      `/products/catalog/${id}`,
      {
        params: {
          page: page - 1,
          pagesize,
        },
      }
    );

    return {
      ...data,
      dateToString:
        new Date(data?.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) ?? "-",
    };
  } catch (err) {
    const error = err as AxiosError;

    const responseError = {
      products: [],
      date: new Date(),
      dateToString: "",
      page: 0,
      pagesize: 0,
      total: 0,
      isError: true,
      error:
        "Desculpe, ocorreu um erro interno ao gerar catálogo, entre em contato com suporte (51) 3441-1000",
    };

    if (error?.response?.status === 400 && error?.response?.data?.message) {
      responseError.error = error?.response?.data?.message;
    }

    return responseError;
  }
}

export function useCatalog({ id, pagesize }: UseCatalogProps) {
  return useInfiniteQuery(
    ["catalog", id, pagesize],
    ({ pageParam = 1 }) => getCatalog({ id, pagesize, page: pageParam }),
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
