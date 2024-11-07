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

type useDiscountScopeProps = {
  returnNull?: boolean;
};

export async function getDiscountScope({ returnNull }: useDiscountScopeProps) {
  if (returnNull) return null;

  const { data } = await api.get<DiscountScope>(
    "/differentiated/discount-scope"
  );

  const response: GetDiscountScopesResponse = {
    discountScope: data,
  };

  return response;
}

export function useDiscountScope(data: useDiscountScopeProps) {
  return useQuery(["discount-scope"], () => getDiscountScope(data), {});
}
