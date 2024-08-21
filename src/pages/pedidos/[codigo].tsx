import {
  Box,
  Button,
  Link as CharkraLink,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoBagHandle } from "react-icons/io5";
import { Me } from "../../@types/me";

import { setupAPIClient } from "../../service/api";

import { useLoading } from "../../contexts/LoadingContext";
import {
  selectStatusColor,
  selectStatusIcon,
  useOrderOne,
} from "../../hooks/queries/useOrder";

import {
  DetailGoBack,
  DetailHeader,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { GetServerSideProps } from "next";
import { FaTrash } from "react-icons/fa";
import { Client } from "../../components/Client";
import { DifferentiatedApproval } from "../../components/DifferentiatedApproval";
import { DifferentiatedCard } from "../../components/DifferentiatedCard";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { ProductOrder } from "../../components/ProductOrder";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/StoreContext";
import { api } from "../../service/apiClient";

export default function Order() {
  const router = useRouter();
  const toast = useToast();
  const { sketchOrder } = useStore();
  const { setLoading } = useLoading();
  // const { toPDF, targetRef } = reactPDF.usePDF({ filename: "page.pdf" });
  const { codigo } = router.query;
  const { user } = useAuth();

  const { data: order, isLoading } = useOrderOne(Number(codigo));

  const {
    isOpen: isOpenConfirmDeleteOrder,
    onOpen: onOpenConfirmDeleteOrder,
    onClose: onCloseConfirmDeleteOrder,
  } = useDisclosure();

  async function handleSketch() {
    if (order?.codigo) await sketchOrder(order.codigo);
  }

  async function handleDeleteOrder() {
    onOpenConfirmDeleteOrder();
  }

  async function deleteOrder() {
    api.delete(`/orders/${order?.codigo}`);

    await router.push("/pedidos");

    return toast({
      title: "Pedido excluído",
      status: "success",
      position: "top",
      isClosable: true,
    });
  }

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      {/* <button onClick={() => toPDF({ filename: "FILE.PDF" })}>
        Download PDF
      </button> */}

      <Head>
        <title> Pedido | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        Right={
          order?.eRascunho && (
            <HStack>
              <Button
                onClick={handleDeleteOrder}
                variant="unstyled"
                display={["flex", "flex", "flex", "none"]}
                justifyContent="center"
                alignItems="center"
                mr="4"
                leftIcon={
                  <Icon as={FaTrash} color="white" fontSize={"1.8rem"} />
                }
              >
                <Text color="white" display={["none", "none", "flex", "flex"]}>
                  Excluir
                </Text>
              </Button>
              <Button
                onClick={handleSketch}
                variant="unstyled"
                display={["flex", "flex", "flex", "none"]}
                justifyContent="center"
                alignItems="center"
                mr="4"
                leftIcon={
                  <Icon as={IoBagHandle} color="white" fontSize={"1.8rem"} />
                }
              >
                <Text color="white" display={["none", "none", "flex", "flex"]}>
                  Digitar
                </Text>
              </Button>
            </HStack>
          )
        }
      />

      <DetailPage>
        <DetailHeader className="justify-between">
          <div className="flex">
            <DetailGoBack />
            <DetailTitle>Pedido #{order?.codigo}</DetailTitle>
          </div>
        </DetailHeader>
      </DetailPage>

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
          mb="8rem"
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
          </Flex>

          {!isLoading && order && (
            <Stack w="full" align="center" spacing="6" mt="2">
              <Stack
                w="full"
                direction={["column", "column", "column", "row", "row"]}
              >
                <Flex
                  w="full"
                  flexDir="column"
                  justify="start"
                  bg="white"
                  p="3"
                  borderRadius="lg"
                  h={"6.5rem"}
                >
                  <HStack>
                    <Icon
                      as={selectStatusIcon(
                        order.eRascunho ? 99 : order.situacaoPedido?.codigo
                      )}
                      color={selectStatusColor(
                        order.eRascunho ? 99 : order.situacaoPedido?.codigo
                      )}
                      fontSize="4xl"
                    />

                    <Tag
                      size="sm"
                      variant="solid"
                      color="white"
                      bg={selectStatusColor(
                        order.eRascunho ? 99 : order.situacaoPedido?.codigo
                      )}
                      textTransform="uppercase"
                    >
                      {order.eRascunho
                        ? "RASCUNHO"
                        : order.situacaoPedido?.descricao
                        ? order.situacaoPedido?.descricao
                        : "-"}
                    </Tag>
                  </HStack>

                  <HStack mt="1.5" spacing={1}>
                    <Text fontSize="sm" fontWeight="light" color="gray.600">
                      CÓDIGO ERP:
                    </Text>

                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      {order.codigoErp ?? "-"}
                    </Text>
                  </HStack>
                </Flex>

                <Box
                  w="full"
                  h={"6.5rem"}
                  overflow="hidden"
                  bg="white"
                  borderRadius="lg"
                >
                  <Client
                    client={order?.cliente}
                    colorTag={selectStatusColor(
                      order.eRascunho ? 99 : order.situacaoPedido?.codigo
                    )}
                  />
                </Box>

                {order.vendedores.map((seller) => (
                  <Box
                    key={`${seller.vendedor.codigo}-${seller.tipo}`}
                    w="full"
                    display="block"
                    bg="white"
                    p="3"
                    h={"6.5rem"}
                    borderRadius="lg"
                  >
                    <HStack>
                      <Tag
                        size="md"
                        variant="solid"
                        color="white"
                        bg={selectStatusColor(
                          order.eRascunho ? 99 : order.situacaoPedido?.codigo
                        )}
                        borderRadius="lg"
                      >
                        {seller.vendedor.codigo}
                      </Tag>
                      <Text fontSize="md" fontWeight="light">
                        {seller.tipo === 1 ? "VENDEDOR" : "PREPOSTO"}
                      </Text>
                    </HStack>

                    <Box mt="1.5">
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {seller.vendedor.nomeGuerra}
                      </Text>
                      <Text fontSize="sm" fontWeight="light" color="gray.600">
                        {seller.vendedor.nome}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box width="full">
                <Text fontSize="lg" fontWeight="light">
                  DETALHES
                </Text>
                <Box bg="white" p="3" borderRadius="lg">
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

              <Box
                width="full"
                // ref={targetRef}
              >
                <Text fontSize="lg" fontWeight="light">
                  {`ITENS DO PEDIDO (${order?.itens.length})`}
                </Text>
                <Stack borderRadius="lg">
                  {order?.itens.map((item) => (
                    <ProductOrder
                      key={item.codigo}
                      product={item.produto}
                      amount={item.valorTotalFormat}
                      qtd={item.quantidade}
                      unitAmount={item.valorUnitarioFormat}
                    />
                  ))}
                </Stack>
              </Box>

              {user.eVendedor && order.eDiferenciado && !order.eRascunho && (
                <>
                  <Box width="full">
                    <Text fontSize="lg" fontWeight="light">
                      Histórico de Diferenciado
                    </Text>
                    <Stack bg="transparent" borderRadius="lg" rowGap="1">
                      {order?.diferenciados?.map((differentiated) => (
                        <DifferentiatedCard
                          differentiated={differentiated}
                          key={differentiated.id}
                          colorTag={selectStatusColor(
                            order.eRascunho ? 99 : order.situacaoPedido?.codigo
                          )}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {order?.situacaoPedido?.codigo === 6 &&
                    order.vendedorPendenteDiferenciadoCodigo ===
                      user.vendedorCodigo && (
                      <Box width="full">
                        <Text fontSize="lg" fontWeight="light">
                          Aprovar Diferenciado
                        </Text>
                        <DifferentiatedApproval order={order} />
                      </Box>
                    )}
                </>
              )}
            </Stack>
          )}
        </Flex>
      </Flex>

      {order?.eRascunho && (
        <>
          <Button
            onClick={handleSketch}
            colorScheme="blue"
            rounded="full"
            position={["fixed"]}
            bottom="12"
            right="8"
            display={["none", "none", "none", "flex"]}
            justifyContent="center"
            alignItems="center"
            h="14"
            w="14"
          >
            <Flex
              position="relative"
              justifyContent="center"
              alignItems="center"
            >
              <Icon as={IoBagHandle} color="white" fontSize={"1.8rem"} />

              <Text
                fontWeight="normal"
                color="white"
                position="absolute"
                bottom="-10"
                bg="gray.600"
                opacity={0.8}
                px="6px"
                py="2px"
                rounded="md"
                fontSize="md"
              >
                DIGITAR
              </Text>
            </Flex>
          </Button>

          <Button
            onClick={handleDeleteOrder}
            colorScheme="red"
            rounded="full"
            position={["fixed"]}
            bottom="12"
            right="7.5rem"
            display={["none", "none", "none", "flex"]}
            justifyContent="center"
            alignItems="center"
            h="14"
            w="14"
          >
            <Flex
              position="relative"
              justifyContent="center"
              alignItems="center"
            >
              <Icon as={FaTrash} color="white" fontSize={"1.7rem"} />

              <Text
                fontWeight="normal"
                color="white"
                position="absolute"
                bottom="-10"
                bg="gray.600"
                opacity={0.8}
                px="6px"
                py="2px"
                rounded="md"
                fontSize="md"
              >
                DELETAR
              </Text>
            </Flex>
          </Button>
        </>
      )}

      <Modal
        isOpen={isOpenConfirmDeleteOrder}
        onClose={onCloseConfirmDeleteOrder}
        size="lg"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>Excluir rascunho</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Você tem certeza que deseja excluir o rascunho?</Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onCloseConfirmDeleteOrder}>
              Cancelar
            </Button>

            <Button colorScheme="red" onClick={deleteOrder}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get<Me>("/auth/me");

  const redirect = response.data.eCliente || response.data.eVendedor;

  if (!redirect)
    return {
      redirect: {
        destination: "/inicio",
        permanent: true,
      },
    };

  return {
    props: {
      me: response.data,
    },
  };
};
