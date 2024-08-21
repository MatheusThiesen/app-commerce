import { Client } from "@/hooks/queries/useClients";

export type Me = {
  id: string;
  email: string;
  nome: string;

  eCliente: boolean;
  eVendedor: boolean;
  eAdmin: boolean;

  clienteCodigo: number;
  cliente: Client;
  vendedorCodigo: number;
  vendedor: {
    codigo: number;
    nome: string;
    nomeGuerra: string;
  };
};
