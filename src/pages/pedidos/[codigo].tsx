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
import { useEffect, useState } from "react";
import { Me } from "../../@types/me";

import { setupAPIClient } from "../../service/api";

import { useLoading } from "../../contexts/LoadingContext";
import {
  orderStatusStyle,
  selectStatusColor,
  selectStatusIcon,
  useOrderOne,
} from "../../hooks/queries/useOrder";

import { Alert } from "@/components/Alert";
import { ModalAlert } from "@/components/ModalAlert";
import { ModalAlertList } from "@/components/ModalAlertList";
import { ProductOrder } from "@/components/ProductOrder";
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
import {
  CircleX,
  Download,
  EllipsisVertical,
  Mail,
  PenLine,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { GetServerSideProps } from "next";
import { IoBagHandle } from "react-icons/io5";
import { TbShoppingCartCancel } from "react-icons/tb";
import { Resolution, usePDF } from "react-to-pdf";
import { DifferentiatedApproval } from "../../components/DifferentiatedApproval";
import { DifferentiatedCard } from "../../components/DifferentiatedCard";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  GetSketchOrderValidResponse,
  SketchItem,
  useStore,
} from "../../contexts/StoreContext";
import { api } from "../../service/apiClient";

export default function Order() {
  const router = useRouter();
  const toast = useToast();
  const { sketchOrder } = useStore();
  const { setLoading } = useLoading();
  const { user } = useAuth();

  const { codigo } = router.query;
  const { data: order, isLoading } = useOrderOne(Number(codigo));

  const [sketchEditItems, setSketchEditItems] = useState<SketchItem[]>([]);
  const [sketchRemoveItems, setSketchRemoveItems] = useState<SketchItem[]>([]);
  const [isAlertSketch, setIsAlertSketch] = useState<boolean>(false);
  const [isAlertSketchNoItens, setIsAlertSketchNoItens] =
    useState<boolean>(false);

  const { toPDF, targetRef } = usePDF({
    filename: `Pedido #${codigo} - Alpar Store`,
    resolution: Resolution.LOW,
  });

  const {
    isOpen: isOpenConfirmDeleteOrder,
    onOpen: onOpenConfirmDeleteOrder,
    onClose: onCloseConfirmDeleteOrder,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirmCancelOrder,
    onOpen: onOpenConfirmCancelOrder,
    onClose: onCloseConfirmCancelOrder,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmSendOrder,
    onOpen: onOpenConfirmSendOrder,
    onClose: onCloseConfirmSendOrder,
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

  function handleSendEmail() {
    api.post(`/orders/email/${order?.codigo}`);

    return toast({
      title: "Espelho do pedido enviado por email.",
      status: "info",
      position: "top",
      isClosable: true,
    });
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
  async function cancelOrder() {
    api.patch(`/orders/cancel/${order?.codigo}`);

    await router.push("/pedidos");

    return toast({
      title: "Pedido cancelado",
      status: "success",
      position: "top",
      isClosable: true,
    });
  }
  async function sendOrder() {
    const getSketch = await api.post<GetSketchOrderValidResponse>(
      `/orders/sketch/${order?.codigo}`
    );

    if (!getSketch) throw new Error();

    const { itens } = getSketch.data;

    if (itens.atuais.length <= 0) {
      return setIsAlertSketchNoItens(true);
    }

    if (itens.atualizados.length <= 0 && itens.deletados.length <= 0) {
      api.patch(`/orders/send/${order?.codigo}`);
      await router.push("/pedidos");

      return toast({
        title: "Pedido enviado",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } else {
      setSketchEditItems(itens.atualizados);
      setSketchRemoveItems(itens.deletados);
      setIsAlertSketch(true);
    }
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
                  description: "Email do pedido",
                  handle: handleSendEmail,
                  icon: Mail,
                },
                {
                  description: "Espelho do pedido",
                  handle: handleExportOrder,
                  icon: Download,
                },
                {
                  description: "Digitar rascunho",
                  handle: handleSketch,
                  icon: ShoppingBag,
                },
                {
                  description: "Excluir",
                  handle: handleDeleteOrder,
                  icon: Trash2,
                },
                {
                  description: "Digitar",
                  handle: sendOrder,
                  icon: ShoppingCart,
                },
                {
                  description: "Editar",
                  handle: handleSketch,
                  icon: PenLine,
                },
                {
                  description: "Cancelar",
                  handle: cancelOrder,
                  icon: CircleX,
                },
              ]
                .filter((f) =>
                  order?.eRascunho
                    ? true
                    : !["Excluir", "Digitar rascunho"].includes(f.description)
                )
                .filter((f) =>
                  order?.ePendente && user.eVendedor
                    ? true
                    : !["Digitar", "Editar", "Cancelar"].includes(f.description)
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
                description: "Email do pedido",
                handle: handleSendEmail,
                icon: Mail,
              },
              {
                description: "Espelho do pedido",
                handle: handleExportOrder,
                icon: Download,
              },
              {
                description: "Digitar rascunho",
                handle: handleSketch,
                icon: ShoppingBag,
              },
              {
                description: "Excluir",
                handle: handleDeleteOrder,
                icon: Trash2,
              },
              {
                description: "Digitar",
                handle: sendOrder,
                icon: ShoppingCart,
              },
              {
                description: "Editar",
                handle: handleSketch,
                icon: PenLine,
              },
              {
                description: "Cancelar",
                handle: cancelOrder,
                icon: CircleX,
              },
            ]
              .filter((f) =>
                order?.eRascunho
                  ? true
                  : !["Excluir", "Digitar rascunho"].includes(f.description)
              )
              .filter((f) =>
                order?.ePendente && user.eVendedor
                  ? true
                  : !["Digitar", "Editar", "Cancelar"].includes(f.description)
              )}
          />
        </DetailHeader>

        <DetailMain>
          {order?.ePendente && user.eVendedor && (
            <DetailBox className="w-full mb-6">
              <DetailBoxTitle>APROVAÇÃO DO PEDIDO</DetailBoxTitle>

              <div className="gap-2 flex flex-col sm:flex-row">
                <Button
                  flex={1}
                  // variant="outline"
                  onClick={onOpenConfirmSendOrder}
                  leftIcon={<ShoppingCart />}
                  className="py-2"
                  colorScheme="green"
                >
                  Digitar
                </Button>
                <Button
                  flex={1}
                  // variant="outline"
                  onClick={handleSketch}
                  leftIcon={<PenLine />}
                  className="py-2"
                  colorScheme="yellow"
                  color="white"
                  bg="yellow.500"
                  _hover={{ bg: "yellow.600" }}
                >
                  Editar
                </Button>
                <Button
                  flex={1}
                  // variant="outline"
                  onClick={onOpenConfirmCancelOrder}
                  leftIcon={<CircleX />}
                  className="py-2"
                  colorScheme="red"
                >
                  Cancelar
                </Button>
              </div>
            </DetailBox>
          )}
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
          {user.eVendedor && order.eDiferenciado && !order.eRascunho && (
            <Stack w="full" align="center" spacing="6" mt="1.5rem">
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

              {order.vendedorPendenteDiferenciadoCodigo !==
                user?.vendedorCodigo &&
                order?.situacaoPedido?.codigo === 6 && (
                  <DetailBox className="w-full">
                    <DetailBoxTitle>Pendente de aprovação</DetailBoxTitle>

                    <InputBase
                      name="sellerApproval"
                      label="Código"
                      defaultValue={order.vendedorPendenteDiferenciado?.codigo}
                      readOnly
                    />

                    <InputBase
                      name="sellerAllName"
                      label="Nome"
                      defaultValue={order.vendedorPendenteDiferenciado?.nome}
                      readOnly
                    />
                    <InputBase
                      name="sellerAllName"
                      label="Hierarquia"
                      defaultValue={
                        order.vendedorPendenteDiferenciado?.tipoVendedor
                      }
                      readOnly
                    />
                  </DetailBox>
                )}

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
            </Stack>
          )}
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

      <Alert
        title="Cancelar pedido"
        description="Você tem certeza que deseja cancelar o pedido?"
        isOpen={isOpenConfirmCancelOrder}
        onClose={onCloseConfirmCancelOrder}
        onAction={cancelOrder}
        actionDescription="SIM"
        closeDescription="NÃO"
      />
      <Alert
        title="Digitar pedido"
        description="Você tem certeza que deseja digitar o pedido?"
        isOpen={isOpenConfirmSendOrder}
        onClose={onCloseConfirmSendOrder}
        onAction={sendOrder}
        actionDescription="SIM"
        closeDescription="NÃO"
        closeColorSchema="green"
      />

      {isAlertSketchNoItens && (
        <ModalAlert
          isOpen={isAlertSketchNoItens}
          onClose={() => {
            setIsAlertSketchNoItens(false);
          }}
          data={{
            Icon: TbShoppingCartCancel,
            title: "Sem produtos disponíveis.",
          }}
        />
      )}
      {isAlertSketch && (
        <ModalAlertList
          isOpen={isAlertSketch}
          onClose={() => {
            setIsAlertSketch(false);
          }}
          title="Lista de produto que sofreram alterações"
        >
          <Stack py="4" px="4">
            {sketchEditItems.map((item) => {
              const unitAmount = item.valorUnitario;
              const unitAmountFormat = unitAmount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });
              const amount = item.valorUnitario * item.quantidade;
              const amountFormat = amount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });

              return (
                <ProductOrder
                  key={item.produto.codigo}
                  product={item.produto}
                  amount={amountFormat}
                  qtd={item.quantidade}
                  unitAmount={unitAmountFormat}
                  isChange
                />
              );
            })}

            {sketchRemoveItems.map((item) => {
              const unitAmount = item.valorUnitario;
              const amount = item.valorUnitario * item.quantidade;
              const unitAmountFormat = unitAmount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });
              const amountFormat = amount.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });

              return (
                <ProductOrder
                  key={item.produto.codigo}
                  product={item.produto}
                  amount={amountFormat}
                  qtd={item.quantidade}
                  unitAmount={unitAmountFormat}
                  isTrash
                />
              );
            })}

            <div className="flex flex-1 w-full gap-2">
              <Button
                onClick={async () => {
                  api.patch(`/orders/send/${order?.codigo}`);
                  await router.push("/pedidos");

                  return toast({
                    title: "Pedido enviado",
                    status: "success",
                    position: "top",
                    isClosable: true,
                  });
                }}
                type="button"
                colorScheme="orange"
                leftIcon={<Icon as={PenLine} type="button" />}
                className="flex-1"
              >
                EDITAR
              </Button>
              <Button
                onClick={async () => {
                  api.patch(`/orders/send/${order?.codigo}`);
                  await router.push("/pedidos");

                  return toast({
                    title: "Pedido enviado",
                    status: "success",
                    position: "top",
                    isClosable: true,
                  });
                }}
                type="button"
                colorScheme="green"
                leftIcon={<Icon as={IoBagHandle} type="button" />}
                className="flex-1"
              >
                ENVIAR
              </Button>
            </div>
          </Stack>
        </ModalAlertList>
      )}
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
