import { useQuery } from "react-query";
import { ItemFilter } from "../../@types/api-queries";
import { api } from "../../service/apiClient";

type Brand = {
  codigo: number;
  descricao: string;
  valorPedidoMinimo: number;
  valorPedidoMinimoFormat: string;
};

type GetBrandsResponse = {
  brands: Brand[];
};

interface useOrdersFiltersProps {
  filters?: ItemFilter[];
}

export async function getBrands({
  filters,
}: useOrdersFiltersProps): Promise<GetBrandsResponse> {
  const { data } = await api.get<Brand[]>("/brands", {
    params: {
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetBrandsResponse = {
    brands: data.map((brand) => ({
      ...brand,
      valorPedidoMinimoFormat: brand.valorPedidoMinimo.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
  };

  return response;
}

export function useBrands({ filters }: useOrdersFiltersProps) {
  return useQuery(
    ["brands", filters],
    () =>
      getBrands({
        filters,
      }),
    {
      staleTime: 1000 * 60 * 5, // 5 Minutos
    }
  );
}
