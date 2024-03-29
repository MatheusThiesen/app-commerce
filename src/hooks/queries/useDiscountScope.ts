import { useQuery } from "react-query";
import { api } from "../../service/apiClient";

export type DiscountScope = {
  id: string;
  hierarquia: number;
  tipoUsuario: string;
  percentualAprovacao: number;
  percentualSolicitacao: number;
};

type GetDiscountScopesResponse = {
  discountScope: DiscountScope;
};

export async function getDiscountScope() {
  const { data } = await api.get<DiscountScope>(
    "/differentiated/discount-scope"
  );

  const response: GetDiscountScopesResponse = {
    discountScope: data,
  };

  return response;
}

export function useDiscountScope() {
  return useQuery(["discount-scope"], () => getDiscountScope(), {});
}
