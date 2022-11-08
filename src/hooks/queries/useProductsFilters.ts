import { useQuery } from "react-query";
import { api } from "../../service/apiClient";

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

export type ProductApiResponse = FilterList[];

type GetProductsResponse = {
  filters: FilterList[];
};

export async function getProductsFilters(): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products/filters", {});

  const response: GetProductsResponse = {
    filters: data,
  };

  return response;
}

export function useProductsFilters() {
  return useQuery(["products-filters"], () => getProductsFilters(), {});
}
