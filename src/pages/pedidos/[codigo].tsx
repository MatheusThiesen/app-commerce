import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as CharkraLink,
  Divider,
  Flex,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Me } from "../../@types/me";

import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

import { useLoading } from "../../contexts/LoadingContext";
import { useOrderOne } from "../../hooks/queries/useOrder";

import { IoChevronForwardSharp } from "react-icons/io5";
import { Client } from "../../components/Client";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductOrder } from "../../components/ProductOrder";

interface Props {
  me: Me;
}

export default function Order({ me }: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { codigo } = router.query;

  const { data: order, isLoading } = useOrderOne(Number(codigo));

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <Head>
        <title> Pedido | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        user={{ name: me.email }}
      />

      <Flex
        flexDir="column"
        align="center"
        width="full"
        mt={["0", "0", "0", "4"]}
      >
        <Flex
          flexDir="column"
          width="full"
          align="center"
          maxW="1200px"
          px={["4", "4", "4", "4"]}
          pt={["4", "4", "4", "0"]}
          mb="5rem"
        >
          <Flex
            w="full"
            mb="2"
            align="center"
            display={["none", "none", "none", "flex"]}
          >
            <Link href="/pedidos">
              <CharkraLink h="full" color="gray.600">
                Voltar à listagem
              </CharkraLink>
            </Link>

            <Divider h="1rem" mx="2" orientation="vertical" />

            <Breadcrumb
              spacing="8px"
              separator={<IoChevronForwardSharp color="gray.500" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink>{`PEDIDO`}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>

          {!isLoading && order && (
            <Stack w="full" align="center" spacing="6" mt="8">
              <Box width="full">
                <Text fontSize="lg" fontWeight="light">
                  DETALHES
                </Text>
                <Box bg="white" p="3" borderRadius="lg">
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      CÓDIGO ERP
                    </Text>
                    <Text>{order?.codigoErp ?? "-"}</Text>
                  </Box>

                  {order?.situacaoPedido && (
                    <Box mt="1.5">
                      <Text
                        fontWeight="light"
                        fontSize="small"
                        color="gray.500"
                      >
                        SITUAÇÃO
                      </Text>
                      <Text textTransform="uppercase">
                        {order?.situacaoPedido?.descricao}
                      </Text>
                    </Box>
                  )}
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      LISTA DE PREÇO
                    </Text>
                    <Text>{order.tabelaPreco?.descricao}</Text>
                  </Box>
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      CONDIÇÃO PAGAMENTO
                    </Text>
                    <Text>{order.condicaoPagamento.descricao}</Text>
                  </Box>
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      DATA DE ENTRADA
                    </Text>
                    <Text>{order.createdAtFormat}</Text>
                  </Box>
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      DATA DE FATURAMENTO
                    </Text>
                    <Text>{order.dataFaturamentoFormat}</Text>
                  </Box>
                  <Box mt="1.5">
                    <Text fontWeight="light" fontSize="small" color="gray.500">
                      VALOR TOTAL
                    </Text>
                    <Text>{order.valorTotalFormat}</Text>
                  </Box>
                </Box>
              </Box>

              <Box width="full">
                <Text fontSize="lg" fontWeight="light">
                  CLIENTE
                </Text>
                <Client client={order?.cliente} />
              </Box>

              {order.vendedores.map((seller) => (
                <Box width="full">
                  <Text fontSize="lg" fontWeight="light">
                    {seller.tipo === 1 ? "VENDEDOR" : "PREPOSTO"}
                  </Text>
                  <Box
                    w="full"
                    display="block"
                    bg="white"
                    p="3"
                    borderRadius="lg"
                  >
                    <Tag
                      size="md"
                      variant="solid"
                      color="white"
                      bg="red.500"
                      borderRadius="lg"
                    >
                      {seller.vendedor.codigo}
                    </Tag>

                    <Box mt="1.5">
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {seller.vendedor.nomeGuerra}
                      </Text>
                      <Text fontSize="sm" fontWeight="light" color="gray.600">
                        {seller.vendedor.nome}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Box width="full">
                <Text fontSize="lg" fontWeight="light">
                  {`ITENS DO PEDIDO (${order?.itens.length})`}
                </Text>
                <Stack borderRadius="lg">
                  {order?.itens.map((item) => (
                    <ProductOrder
                      product={item.produto}
                      amount={item.valorTotalFormat}
                      qtd={item.quantidade}
                      unitAmount={item.valorUnitarioFormat}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  var me = {};

  const response = await apiClient.get<Me>("/auth/me");

  if (response.data.eVendedor === false)
    return {
      redirect: {
        destination: "/produtos",
        permanent: true,
      },
    };

  return {
    props: {
      me: response.data,
    },
  };
});
