import { useQuery } from "react-query";
import { PriceList } from "../../contexts/StoreContext";
import { api } from "../../service/apiClient";

type GetPriceListsResponse = {
  priceLists: PriceList[];
};

export async function getPriceList(): Promise<GetPriceListsResponse> {
  const { data } = await api.get<PriceList[]>("/price-tables");

  const response: GetPriceListsResponse = {
    priceLists: data,
  };

  return response;
}

export function usePriceList() {
  return useQuery(["price-list"], () => getPriceList(), {
    staleTime: 1000 * 60 * 5, // 5 Minutos
  });
}
