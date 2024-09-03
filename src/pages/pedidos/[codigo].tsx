import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Me } from "../../@types/me";

import { setupAPIClient } from "../../service/api";

import { useLoading } from "../../contexts/LoadingContext";
import {
  orderStatusStyle,
  selectStatusColor,
  selectStatusIcon,
  useOrderOne,
} from "../../hooks/queries/useOrder";

import { GroupInput } from "@/components/form-tailwind/GroupInput";
import { InputBase } from "@/components/form-tailwind/InputBase";
import {
  DetailBox,
  DetailBoxTitle,
  DetailContent,
  DetailGoBack,
  DetailHeader,
  DetailMain,
  DetailOptionsActions,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import { ProductItem } from "@/components/product-item";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, EllipsisVertical, ShoppingBag, Trash2 } from "lucide-react";
import { GetServerSideProps } from "next";
import { Resolution, usePDF } from "react-to-pdf";
import { DifferentiatedApproval } from "../../components/DifferentiatedApproval";
import { DifferentiatedCard } from "../../components/DifferentiatedCard";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/StoreContext";
import { api } from "../../service/apiClient";

export default function Order() {
  const router = useRouter();
  const toast = useToast();
  const { sketchOrder } = useStore();
  const { setLoading } = useLoading();

  const { codigo } = router.query;
  const { user } = useAuth();

  const { data: order, isLoading } = useOrderOne(Number(codigo));

  const { toPDF, targetRef } = usePDF({
    filename: `Pedido #${codigo} - Alpar Store`,
    resolution: Resolution.LOW,
  });

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

  function handleExportOrder() {
    toPDF();
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

  if (isLoading || !order) return <ScreenLoading />;

  return (
    <>
      <Head>
        <title> Pedido | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title={`Pedido #${order?.codigo}`}
        Right={
          <div className="flex lg:hidden">
            <DetailOptionsActions
              detailOptionsActionsTrigger={
                <Button
                  bg="transparent"
                  display="flex"
                  _hover={{ bg: "transparent" }}
                  className="flex items-center justify-center mr-3"
                >
                  <EllipsisVertical color="white" className="size-7" />
                  <span className="text-white ">Mais</span>
                </Button>
              }
              data={[
                {
                  description: "Espelho pedido",
                  handle: handleExportOrder,
                  icon: Download,
                },
                {
                  description: "Digitar rascunho",
                  handle: handleSketch,
                  icon: ShoppingBag,
                },
                {
                  description: "Deletar pedido",
                  handle: handleDeleteOrder,
                  icon: Trash2,
                },
              ].filter((f) =>
                order?.eRascunho
                  ? true
                  : !["Deletar pedido", "Digitar rascunho"].includes(
                      f.description
                    )
              )}
            />
          </div>
        }
      />

      <DetailPage>
        <DetailHeader className="justify-between hidden lg:flex">
          <div className="flex ">
            <DetailGoBack />
            <DetailTitle>Pedido #{order?.codigo}</DetailTitle>
          </div>

          <DetailOptionsActions
            data={[
              {
                description: "Espelho pedido",
                handle: handleExportOrder,
                icon: Download,
              },
              {
                description: "Digitar rascunho",
                handle: handleSketch,
                icon: ShoppingBag,
              },
              {
                description: "Deletar pedido",
                handle: handleDeleteOrder,
                icon: Trash2,
              },
            ].filter((f) =>
              order?.eRascunho
                ? true
                : !["Deletar pedido", "Digitar rascunho"].includes(
                    f.description
                  )
            )}
          />
        </DetailHeader>

        <DetailMain>
          <div ref={targetRef} className="bg-slate-100">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="hidden lg:flex">
                    <div className="flex flex-row justify-between items-center w-full">
                      <DetailBoxTitle>Situação</DetailBoxTitle>
                      <div className="flex gap-x-2">
                        <Icon
                          as={selectStatusIcon(
                            order.eRascunho ? 99 : order.situacaoPedido?.codigo
                          )}
                          color={selectStatusColor(
                            order.eRascunho ? 99 : order.situacaoPedido?.codigo
                          )}
                          fontSize="4xl"
                        />

                        <Badge
                          variant="outline"
                          className={cn(
                            orderStatusStyle[
                              (order.situacaoPedido?.codigo ?? 1) as 1
                            ].bgColor,
                            "text-white rounded-lg hover:bg text-md "
                          )}
                        >
                          {order.situacaoPedido?.descricao}
                        </Badge>
                      </div>
                    </div>

                    {order.codigoErp > 0 && (
                      <div className="text-sm w-full">
                        <span className="font-thin">CÓDIGO ERP:</span>
                        <span className="font-bold">{order.codigoErp}</span>
                      </div>
                    )}
                  </DetailBox>

                  <DetailBox className="w-full">
                    <DetailBoxTitle>Cliente</DetailBoxTitle>

                    <InputBase
                      name="clientCod"
                      label="Código"
                      defaultValue={order.cliente.codigo}
                      readOnly
                    />
                    <InputBase
                      name="clienteName"
                      label="Razão social"
                      defaultValue={order.cliente.razaoSocial}
                      readOnly
                    />
                    <InputBase
                      name="cnpj"
                      label="CNPJ"
                      defaultValue={order.cliente.cnpjFormat}
                      readOnly
                    />
                  </DetailBox>

                  {order.vendedores.map((seller) => (
                    <DetailBox
                      key={
                        seller.vendedor.codigo.toLocaleString() + seller.tipo
                      }
                      className="w-full"
                    >
                      <DetailBoxTitle>
                        {seller.tipo === 1 ? "Vendedor" : "Preposto"}
                      </DetailBoxTitle>

                      <InputBase
                        name="sellerCod"
                        label="Código"
                        defaultValue={seller.vendedor.codigo}
                        readOnly
                      />
                      <InputBase
                        name="sellerName"
                        label="Abreviação"
                        defaultValue={seller.vendedor.nomeGuerra}
                        readOnly
                      />
                      <InputBase
                        name="sellerAllName"
                        label="Nome"
                        defaultValue={seller.vendedor.nome}
                        readOnly
                      />
                    </DetailBox>
                  ))}
                </>
              }
            >
              <DetailBox className="flex lg:hidden">
                <div className="flex flex-row justify-between items-center w-full">
                  <DetailBoxTitle>Situação</DetailBoxTitle>
                  <div className="flex gap-x-2">
                    <Icon
                      as={selectStatusIcon(
                        order.eRascunho ? 99 : order.situacaoPedido?.codigo
                      )}
                      color={selectStatusColor(
                        order.eRascunho ? 99 : order.situacaoPedido?.codigo
                      )}
                      fontSize="4xl"
                    />

                    <Badge
                      variant="outline"
                      className={cn(
                        orderStatusStyle[
                          (order.situacaoPedido?.codigo ?? 1) as 1
                        ].bgColor,
                        "text-white rounded-lg hover:bg text-md "
                      )}
                    >
                      {order.situacaoPedido?.descricao}
                    </Badge>
                  </div>
                </div>

                {order.codigoErp > 0 && (
                  <div className="text-sm w-full">
                    <span className="font-thin">CÓDIGO ERP:</span>
                    <span className="font-bold">{order.codigoErp}</span>
                  </div>
                )}
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Detalhes</DetailBoxTitle>

                {order.codigoErp > 0 && (
                  <InputBase
                    name="codeErp"
                    label="Código ERP"
                    defaultValue={order.codigoErp ?? "-"}
                    readOnly
                  />
                )}

                <InputBase
                  name="priceList"
                  label="Lista de preço"
                  defaultValue={order.tabelaPreco.descricao}
                  readOnly
                />

                <InputBase
                  name="paymentCondition"
                  label="Condição pagamento"
                  defaultValue={order.condicaoPagamento.descricao}
                  readOnly
                />

                <InputBase
                  name="stockPeriod"
                  label="Tipo da venda"
                  defaultValue={order.periodoEstoque.descricao}
                  readOnly
                />

                <GroupInput>
                  <InputBase
                    name="createAt"
                    label="Data de entrada"
                    defaultValue={order.createdAtFormat}
                    readOnly
                  />
                  <InputBase
                    name="billingDate"
                    label="Data de faturamento"
                    defaultValue={order.dataFaturamentoFormat}
                    readOnly
                  />
                </GroupInput>
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Resumo</DetailBoxTitle>

                {order.itens.map((item) => (
                  <div key={item.codigo}>
                    <ProductItem
                      data={item}
                      status={order.situacaoPedido?.descricao}
                    />

                    {<Separator />}
                  </div>
                ))}

                <div className="flex justify-between  text-sm">
                  <span>Subtotal</span>
                  <span>{order.valorTotalFormat}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm ">
                  <span>Descontos</span>
                  <span className="text-green-500">
                    -{order.descontoValorFormat}
                  </span>
                </div>

                {Number(order.cancelamentoValor ?? 0) > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm ">
                      <span>Cancelamentos</span>
                      <span className="text-red-400">
                        -{order.cancelamentoValorFormat}
                      </span>
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex justify-between text-md font-bold">
                  <span>Valor total</span>
                  <span>{order.descontoCalculadoFormat}</span>
                </div>
              </DetailBox>
            </DetailContent>
          </div>

          <Stack w="full" align="center" spacing="6" mt="1.5rem">
            {user.eVendedor && order.eDiferenciado && !order.eRascunho && (
              <>
                <Box width="full">
                  <Text fontSize="lg" fontWeight="light">
                    Histórico de Diferenciado
                  </Text>
                  <Stack bg="transparent" borderRadius="lg" rowGap="4">
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
        </DetailMain>
      </DetailPage>

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
