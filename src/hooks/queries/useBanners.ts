import { useQuery } from "react-query";
import { api } from "../../service/apiClient";

type Banner = {
  id: string;
  titulo: string;
  eAtivo: boolean;
  urlSearch: string;
  imagemDesktop: FileProps;
  imagemMobile: FileProps;
};

type FileProps = {
  id: string;
  nome: string;
  url: string;
  tamanho: number;
  tipoArquivo: string;
};

type GetBannersResponse = {
  banners: Banner[];
};

export async function getBanners(): Promise<GetBannersResponse> {
  const { data } = await api.get<Banner[]>("/banners", {});

  const response: GetBannersResponse = {
    banners: data,
  };

  return response;
}

export function useBanners() {
  return useQuery(["banners"], () => getBanners(), {
    staleTime: 1000 * 60 * 5, // 5 Minutos
  });
}
