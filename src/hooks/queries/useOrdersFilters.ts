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

type GetOrdersResponse = {
  filters: FilterList[];
};

interface useOrdersFiltersProps {
  filters?: ItemFilter[];
}

export async function getOrdersFilters({
  filters,
}: useOrdersFiltersProps): Promise<GetOrdersResponse> {
  const { data } = await api.get<ProductApiResponse>("/orders/filters", {
    params: {
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetOrdersResponse = {
    filters: data,
  };

  return response;
}

export function useOrdersFilters({ filters }: useOrdersFiltersProps) {
  return useQuery(
    ["orders-filters", filters],
    () =>
      getOrdersFilters({
        filters,
      }),
    {
      staleTime: 1000 * 60 * 5, // 5 Minutos
    }
  );
}
