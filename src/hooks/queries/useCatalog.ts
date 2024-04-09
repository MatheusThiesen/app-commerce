import { AxiosError } from "axios";
import { useInfiniteQuery, useQuery } from "react-query";
import { api } from "../../service/apiClient";

export type getCatalogProps = {
  id?: string;
  page: number;
  pagesize?: number;
  search?: string;
};

export type UseCatalogProps = Omit<getCatalogProps, `page`>;

export type CatalogApiResponse = {
  products: ProductPage[];
  date: Date;
  dateToString: string;
  page: number;
  pagesize: number;
  hasNextPage: boolean;

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
  priceList28: string;
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

export async function getCatalog({
  id,
  page,
  pagesize,
  search,
}: getCatalogProps) {
  try {
    const { data } = await api.get<CatalogApiResponse>(`/catalog/${id}`, {
      params: {
        page: page - 1,
        pagesize,
        search,
      },
    });

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
      hasNextPage: false,
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

export function useCatalog({ id, pagesize, search }: UseCatalogProps) {
  return useInfiniteQuery(
    ["catalog", id, pagesize, search],
    ({ pageParam = 1 }) =>
      getCatalog({ id, pagesize, search, page: pageParam }),
    {
      refetchOnWindowFocus: false,
      // getPreviousPageParam: (firstPage, allPages) => undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNextPage) return undefined;

        return lastPage.page + 2;
      },
    }
  );
}

export async function getCatalogTotalCount(
  id?: string,
  search?: string
): Promise<{ total: number }> {
  if (!id) return { total: 0 };

  const { data } = await api.get<{ total: number }>(
    `/catalog/totalCount/${id}`,
    {
      params: {
        search,
      },
    }
  );

  return data;
}
export function useCatalogTotalCount(id?: string, search?: string) {
  return useQuery(
    ["catalogTotalCount", id, search],
    () => getCatalogTotalCount(id, search),
    {
      staleTime: 1000 * 60 * 5, // 5 Minutos
    }
  );
}
