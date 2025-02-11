import { useQuery } from "react-query";
import { api } from "../../service/apiClient";

type PaymentCondition = {
  codigo: number;
  descricao: string;
  listaPrecoCodigo: number;
  valorMinimo: number;
  eApenasDiferenciado: boolean;
  marcaCodigo: number;
};

type GetPaymentConditionsResponse = {
  paymentConditions: PaymentCondition[];
};

interface useOrdersFiltersProps {
  brandCod?: number;
  totalAmount?: number;
  priceListCod?: number;
  isDifferentiated?: boolean;
}

export async function getPaymentConditions(
  filters?: useOrdersFiltersProps
): Promise<GetPaymentConditionsResponse> {
  const { data } = await api.get<{ paymentConditions: PaymentCondition[] }>(
    "/payment-conditions",
    {
      params: {
        ...filters,
      },
    }
  );

  const response: GetPaymentConditionsResponse = {
    paymentConditions: data.paymentConditions,
  };

  return response;
}

export function usePaymentConditions(filters?: useOrdersFiltersProps) {
  return useQuery(
    ["payment-conditions", filters],
    () => getPaymentConditions(filters),
    {
      staleTime: 1000 * 60 * 5, // 5 Minutos
    }
  );
}
