import { useQuery } from "react-query";
import { api } from "../../service/apiClient";

export type UseCatalogProps = {
  id?: string;
};
export type ItemFilter = {
  name: string;
  value: number | string;
  field: number | string;
};

export type CatalogApiResponse = {
  products: ProductPage[];

  date: Date;
  dateToString: string;
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

export async function getCatalog({ id }: UseCatalogProps) {
  if (!id) return undefined;

  const { data } = await api.get<CatalogApiResponse>(`/products/catalog/${id}`);

  return {
    ...data,
    dateToString:
      new Date(data?.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) ?? "-",
  };
}

export function useCatalog({ id }: UseCatalogProps) {
  return useQuery(["catalog", id], () => getCatalog({ id }), {});
}
