import { GetServerSidePropsContext } from "next";
import { useInfiniteQuery, useQuery } from "react-query";
import { mask } from "remask";
import { ItemFilter } from "../../@types/api-queries";
import { setupAPIClient } from "../../service/api";
import { api } from "../../service/apiClient";

export type Client = {
  codigo: number;
  eAtivo: boolean;
  razaoSocial: string;
  nomeFantasia: string;
  cidade: string;
  cep: string;
  cepFormat: string;
  cnpj: string;
  cnpjFormat: string;
  uf: string;
  bairro: string;
  logradouro: string;
  numero: string;
  incricaoEstadual: string;
  complemento?: string;
  telefone: string;
  telefone2?: string;
  celular?: string;
  telefoneFormat?: string;
  telefone2Format?: string;
  celularFormat?: string;
  obs?: string;
  email?: string;
  email2?: string;

  titulo?: {
    id: string;
  }[];
  conceito?: {
    codigo: string;
    descricao: string;
  };
  ramoAtividade?: {
    codigo: string;
    descricao: string;
  };
};

type ClientApiResponse = {
  data: Client[];
  page: number;
  pagesize: number;
  total: number;
};

type GetClientsResponse = {
  clients: Client[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetClientsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  filters?: ItemFilter[];
  search?: string;
}
type UseClientsProps = Omit<GetClientsProps, "page">;

export async function getClients({
  page,
  pagesize,
  orderby,
  filters,
  search,
}: GetClientsProps): Promise<GetClientsResponse> {
  const { data } = await api.get<ClientApiResponse>("/clients", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetClientsResponse = {
    clients: data.data.map((client) => ({
      ...client,
      cepFormat: mask(client.cep, "99999-999"),
      cnpjFormat: mask(client.cnpj, "99.999.999/9999-99"),
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getClientOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Client> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  const { data: client } = await apiClient.get<Client>(`/clients/${cod}`);

  const product: Client = {
    ...client,
    cepFormat: mask(client.cep, "99999-999"),
    cnpjFormat: mask(client.cnpj, "99.999.999/9999-99"),
    telefone2Format: client.telefone2
      ? mask(client.telefone2, [
          "9999-9999",
          "99999-9999",
          "(99) 9999-9999",
          "(99) 99999-9999",
        ])
      : undefined,
    telefoneFormat: client.telefone
      ? mask(client.telefone, [
          "9999-9999",
          "99999-9999",
          "(99) 9999-9999",
          "(99) 99999-9999",
        ])
      : undefined,
  };

  return product;
}

export function useClients({
  pagesize,
  orderby,
  filters,
  search,
}: UseClientsProps) {
  return useInfiniteQuery(
    ["clients", pagesize, orderby, filters, search],

    ({ pageParam = 1 }) => {
      return getClients({
        page: pageParam,
        pagesize,
        orderby,
        filters,
        search,
      });
    },
    {
      // getPreviousPageParam: (firstPage, allPages) => undefined,
      getNextPageParam: (lastPage) => {
        const totalCount = lastPage?.page * lastPage?.pagesize;

        if (totalCount >= lastPage?.total) return undefined;

        return lastPage.page + 2;
      },
    }
  );
}
export function useClientOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery(["client", codigo], () => getClientOne(codigo, ctx), {});
}
