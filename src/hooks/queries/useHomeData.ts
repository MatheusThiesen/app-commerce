import { useQuery } from "react-query";
import { api } from "../../service/apiClient";
import { Brand, Product } from "./useProducts";

type HomeData = {
  brands: Brand[];

  products: Product[];

  lines: {
    codigo: number;
    descricao: string;
  }[];
};

type GetHomeDatasResponse = HomeData;

export async function getHomeData(): Promise<GetHomeDatasResponse> {
  const { data } = await api.get<HomeData>("/home-data");

  return {
    ...data,
    products: data.products.map((product) => ({
      ...product,
      precoVendaFormat: product.precoVenda.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
  };
}

export function useHomeData() {
  return useQuery(["home-data"], () => getHomeData(), {
    staleTime: 1000 * 60 * 5, // 5 Minutos
  });
}
