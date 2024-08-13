export type Me = {
  id: string;
  email: string;
  nome: string;

  eCliente: boolean;
  eVendedor: boolean;
  eAdmin: boolean;

  clienteCodigo: number;
  cliente: {
    codigo: number;
    cnpj: string;
    nomeFantasia: string;
  };
  vendedorCodigo: number;
  vendedor: {
    codigo: number;
    nome: string;
    nomeGuerra: string;
  };
};
