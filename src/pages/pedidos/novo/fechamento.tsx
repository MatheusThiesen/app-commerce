import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";

import { Me } from "../../../@types/me";
import { setupAPIClient } from "../../../service/api";

import { IoArrowBack } from "react-icons/io5";
import { MdShoppingCartCheckout } from "react-icons/md";

import { Client } from "../../../components/Client";
import { HeaderNavigation } from "../../../components/HeaderNavigation";
import { ProductStore } from "../../../components/ProductStore";
import {
  Differentiated,
  Order,
  PaymentCondition,
  useStore,
} from "../../../contexts/StoreContext";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { BiCartDownload } from "react-icons/bi";
import { Input } from "../../../components/Form/Input";
import { InputSelect } from "../../../components/Form/InputSelect";
import { Textarea } from "../../../components/Form/TextArea";
import { useBrands } from "../../../hooks/queries/useBrands";
import { useDiscountScope } from "../../../hooks/queries/useDiscountScope";
import { api } from "../../../service/apiClient";

type PaymentConditionResponse = {
  paymentConditions: PaymentCondition[];

  priceListCod: number;
  totalAmount: number;
  clientCod: number;

  stockLocationPeriod: string;
  brandCod: number;
};

type PaymentConditionState = {
  paymentConditions: PaymentCondition[];

  stockLocationPeriod: string;
  brandCod: number;
};

export default function CheckoutOrder() {
  const toast = useToast();
  const { data } = useBrands({});
  const { user } = useAuth();

  const discountScope = useDiscountScope({
    returnNull: !user?.vendedorCodigo,
  });
  const [fetchingOrder, setFetchingOrder] = useState(false);

  const {
    orders,
    client,
    priceList,
    totalAmountFormat,
    totalItems,
    validOrders,
    setPaymentCondition,
    sendOrder,
    setDifferentiated,
  } = useStore();

  const [paymentConditionOrders, setPaymentConditionOrders] = useState<
    PaymentConditionState[]
  >([]);

  const validMinimumAllOrder =
    orders
      .map((order) => validateMinimumOrder(order.brand.codigo, order.amount))
      .filter((f) => f).length > 0;

  const validDifferentiatedAllOrder =
    orders.map((order) => validateDifferentiatedOrder(order)).filter((f) => f)
      .length > 0;

  function onSelectPaymentCondition({
    brandCod,
    stockLocationPeriod,
  }: {
    stockLocationPeriod: string;
    brandCod: number;
  }) {
    const findPaymentCondition = paymentConditionOrders.find(
      (paymentCondition) =>
        paymentCondition.brandCod === brandCod &&
        paymentCondition.stockLocationPeriod === stockLocationPeriod
    );

    if (!findPaymentCondition) return [];

    return findPaymentCondition.paymentConditions.map((payment) => ({
      value: payment.codigo,
      label: payment.descricao,
    }));
  }

  function validateMinimumOrder(
    brandCode: number,
    orderAmount: number
  ): boolean {
    const findBrand = data?.brands.find((b) => b.codigo === brandCode);
    if (findBrand) return findBrand.valorPedidoMinimo - orderAmount > 0;

    return true;
  }

  function validateDifferentiatedOrder(order: Order): boolean {
    if (order.differentiated?.isActive) {
      if (order.differentiated?.tipoDesconto) {
        switch (order.differentiated?.tipoDesconto) {
          case "PERCENTUAL":
            return !(Number(order.differentiated?.descontoPercentual) >= 0);
          case "VALOR":
            return !(Number(order.differentiated?.descontoValor) >= 0);
        }
      } else {
        return true;
      }
    }

    return false;
  }

  function onChangeInputDifferentiated(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    order: Order
  ) {
    const { name, value } = event.target;

    let differentiated: Differentiated = {
      ...order.differentiated,
      isActive: true,
    };

    const maxPercentage =
      discountScope.data?.discountScope.percentualSolicitacao ?? 0;
    const maxValue = maxPercentage ? order.amount * (maxPercentage / 100) : 0;

    switch (name) {
      case "tipoDesconto":
        if (value === "VALOR") {
          differentiated.tipoDesconto = "VALOR";
        }
        if (value === "PERCENTUAL") {
          differentiated.tipoDesconto = "PERCENTUAL";
        }

        differentiated.descontoPercentual = undefined;
        differentiated.descontoValor = undefined;
        differentiated.motivoDiferenciado = undefined;

        break;
      case "descontoValor":
        const valueDiscount = Number(value.replace(/\D/g, "")) / 100;

        if (valueDiscount <= maxValue) {
          differentiated.descontoValor = valueDiscount >= 0 ? valueDiscount : 0;

          differentiated.amountDiscount = differentiated.descontoValor;
          differentiated.amountDiscountFormat =
            differentiated.descontoValor.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            });
        } else {
          return toast({
            title: `Desconto máximo permitido ${
              discountScope.data?.discountScope.percentualSolicitacao
            }% (${maxValue.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })})`,
            status: "warning",
            position: "top",
            isClosable: true,
          });
        }

        break;
      case "motivoDiferenciado":
        differentiated.motivoDiferenciado = value;

        break;
      case "descontoPercentual":
        const valuePercentage = value
          .replace(/[^0-9.,]/g, "")
          .replace(",", ".");

        if (Number(valuePercentage) <= maxPercentage) {
          if (Number(valuePercentage) >= 0) {
            differentiated.descontoPercentual = valuePercentage;
          }

          if (Number(valuePercentage) < 0) {
            differentiated.descontoPercentual = "0";
          }

          differentiated.amountDiscount =
            (Number(differentiated.descontoPercentual ?? 0) / 100) *
            order.amount;
          differentiated.amountDiscountFormat =
            differentiated.amountDiscount.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            });
        } else {
          return toast({
            title: `Desconto máximo permitido ${
              discountScope.data?.discountScope.percentualSolicitacao
            }% (${maxValue.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })})`,
            status: "warning",
            position: "top",
            isClosable: true,
          });
        }

        break;
    }

    setDifferentiated({
      order: order,
      differentiated: differentiated,
    });
  }

  async function handleSendOrder() {
    setFetchingOrder(true);
    await sendOrder({
      isDraft: false,
    });
    setFetchingOrder(false);
  }

  useEffect(() => {
    (async () => {
      let paymentConditionOrdersNormalized: PaymentConditionState[] = [];

      for (const order of orders) {
        const paymentConditions = await api.post<PaymentConditionResponse>(
          "/payment-conditions/list-to-order",
          {
            brandCod: order.brand.codigo,
            priceListCod: priceList?.codigo,
            totalAmount: order.amount,
            clientCod: client?.codigo,
            stockLocationPeriod: order.stockLocation.periodo,
            isDifferentiated: order.differentiated?.isActive,
          }
        );

        paymentConditionOrdersNormalized.push({
          brandCod: paymentConditions.data.brandCod,
          stockLocationPeriod: paymentConditions.data.stockLocationPeriod,
          paymentConditions: paymentConditions.data.paymentConditions,
        });
      }

      setPaymentConditionOrders(paymentConditionOrdersNormalized);
    })();
  }, [orders]);

  return (
    <>
      <Head>
        <title>Pedido fechamento | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isGoBack
        title="Fechamento"
        isNotNavigation={!user?.eCliente}
        isInativeEventScroll
      />

      <Flex pt={["0", "0", "0", "8"]} pb={["7rem"]} justify="center" w="full">
        <Stack w="full" maxW="1200px" px="1rem" spacing="1.5rem">
          <Flex
            align={"center"}
            display={["none", "none", "none", "flex"]}
            mb="2rem"
          >
            <Button
              p="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => Router.back()}
              mr="1rem"
              px="4"
              bg="transparent"
            >
              <Icon as={IoArrowBack} color="gray.800" fontSize={"1.8rem"} />
              <Text color="gray.800" fontSize={"md"} ml="2">
                Voltar
              </Text>
            </Button>

            <Text
              as="h1"
              fontSize="4xl"
              fontWeight="bold"
              color="gray.700"
              lineHeight="2rem"
            >
              Fechamento do pedido
            </Text>
          </Flex>

          <Box>
            <Text fontSize="lg" fontWeight="light" mb={"1"}>
              CLIENTE
            </Text>
            {client && <Client client={client} />}
          </Box>

          {!user?.eCliente && (
            <Box>
              <Text fontSize="lg" fontWeight="light" mb={"1"}>
                LISTA DE PREÇO
              </Text>
              <Box bg="white" p="3" borderRadius="lg">
                <Text fontWeight="bold" fontSize="lg">
                  {priceList?.descricao}
                </Text>
              </Box>
            </Box>
          )}

          <Box>
            <Text fontSize="lg" fontWeight="light" mb={"1"}>
              PEDIDO(S)
            </Text>

            <Accordion defaultIndex={0} allowToggle>
              {orders.map((order) => {
                const validateMinimum = validateMinimumOrder(
                  order.brand.codigo,
                  order.amount
                );

                const validateDifferentiated =
                  validateDifferentiatedOrder(order);

                const validOrder = validateMinimum || validateDifferentiated;

                return (
                  <AccordionItem
                    key={`${order.stockLocation.periodo}${order.brand.descricao}`}
                    border={0}
                    bg="white"
                    mb="1rem"
                    borderRadius="md"
                  >
                    <AccordionButton py="3">
                      <Box as="span" flex="1" textAlign="left">
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={
                            order.paymentCondition && !validOrder
                              ? "green"
                              : "red"
                          }
                        >
                          {`${order.brand.descricao} - ${order.stockLocation.descricao} - ${order.amountFormat}`}
                          {validateMinimum &&
                            ` - ( VALOR MÍNIMO ${
                              data?.brands.find(
                                (b) => +b.codigo === +order.brand.codigo
                              )?.valorPedidoMinimoFormat
                            } )`}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel borderTop="1px" borderColor="gray.100">
                      <Accordion defaultIndex={1} allowToggle borderRadius="4">
                        <AccordionItem border={1} mb="1rem" borderRadius="md">
                          <AccordionButton paddingX={"0"}>
                            <Text fontSize="lg" fontWeight="light">
                              {`Itens (${order.items.length})`}
                            </Text>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel
                            borderTop="1px"
                            borderColor="gray.100"
                          >
                            {order.items.map((item) => (
                              <Box
                                key={item.product.codigo}
                                borderBottom="1px"
                                borderColor="gray.100"
                                pb="2"
                              >
                                <ProductStore
                                  product={item.product}
                                  amount={item.amountFormat}
                                  qtd={item.qtd}
                                  stockLocation={order.stockLocation}
                                  isOnlyInfo
                                />
                              </Box>
                            ))}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>

                      {/* PEDIDO DIFERENCIADO */}
                      {!user?.eCliente && (
                        <>
                          <Text fontSize="md" fontWeight="bold" mb={"1"} mr="2">
                            Diferenciado
                          </Text>
                          <Switch
                            isChecked={order.differentiated?.isActive}
                            onChange={(e) => {
                              setDifferentiated({
                                order: order,
                                differentiated: {
                                  isActive: !!e.target.checked,
                                },
                              });
                            }}
                            size="lg"
                            colorScheme="blue"
                          />
                        </>
                      )}

                      <Box mt="1rem">
                        <Text mb="2" fontSize="md" fontWeight="bold">
                          Condição de Pagamento
                        </Text>
                        <InputSelect
                          name="paymentCondition"
                          value={order.paymentCondition?.codigo ?? ""}
                          onChange={(e) => {
                            if (e) {
                              const find = onSelectPaymentCondition({
                                brandCod: order.brand.codigo,
                                stockLocationPeriod:
                                  order.stockLocation.periodo,
                              }).find(
                                (f) =>
                                  Number(f.value) === Number(e.target.value)
                              );

                              if (find)
                                setPaymentCondition({
                                  brandCod: order.brand.codigo,
                                  stockLocationPeriod:
                                    order.stockLocation.periodo,
                                  paymentCondition: {
                                    codigo: Number(find.value),
                                    descricao: find.label,
                                  },
                                });
                            }
                          }}
                        >
                          <option value="">Selecionar...</option>
                          {onSelectPaymentCondition({
                            brandCod: order.brand.codigo,
                            stockLocationPeriod: order.stockLocation.periodo,
                          }).map((item) => (
                            <option value={item.value}>{item.label}</option>
                          ))}
                        </InputSelect>
                      </Box>

                      {order.differentiated?.isActive && (
                        <Stack mt="4">
                          <InputSelect
                            name="tipoDesconto"
                            label="Tipo de Desconto"
                            onChange={(event) =>
                              onChangeInputDifferentiated(event, order)
                            }
                            value={order.differentiated.tipoDesconto}
                          >
                            <option value="">Selecionar...</option>
                            <option value="VALOR">Valor fixo</option>
                            <option value="PERCENTUAL">Percentual</option>
                          </InputSelect>

                          {order.differentiated.tipoDesconto ===
                            "PERCENTUAL" && (
                            <Input
                              label="Percentual de Desconto"
                              name="descontoPercentual"
                              onChange={(e) =>
                                onChangeInputDifferentiated(e, order)
                              }
                              value={
                                !!order.differentiated?.descontoPercentual
                                  ? `% ${order.differentiated.descontoPercentual}`
                                  : ""
                              }
                            />
                          )}

                          {order.differentiated.tipoDesconto === "VALOR" && (
                            <Input
                              label="Valor do Desconto"
                              name="descontoValor"
                              onChange={(e) =>
                                onChangeInputDifferentiated(e, order)
                              }
                              value={order.differentiated.descontoValor?.toLocaleString(
                                "pt-br",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            />
                          )}

                          {!!order.differentiated.tipoDesconto && (
                            <Box position="relative">
                              <Textarea
                                name="motivoDiferenciado"
                                isDisabled={!order.differentiated.tipoDesconto}
                                label="Obervação"
                                onChange={(event) =>
                                  onChangeInputDifferentiated(event, order)
                                }
                                value={order.differentiated.motivoDiferenciado}
                                maxLength={200}
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="light"
                                position="absolute"
                                top="1"
                                right="1"
                              >
                                {`${
                                  order.differentiated.motivoDiferenciado
                                    ?.length ?? 0
                                }/200`}
                              </Text>
                            </Box>
                          )}
                        </Stack>
                      )}

                      <Flex justify="space-between" mt="8">
                        <Text
                          fontSize={["sm", "sm", "md", "md"]}
                          color="gray.700"
                        >{`Quantidade`}</Text>
                        <Text
                          fontSize={["sm", "sm", "md", "md"]}
                          color="gray.700"
                        >{`${order.items.length} itens`}</Text>
                      </Flex>

                      {order.differentiated?.isActive && (
                        <>
                          <Flex justify="space-between">
                            <Text
                              fontSize={["sm", "sm", "md", "md"]}
                              color="gray.700"
                            >{`Subtotal`}</Text>
                            <Text
                              fontSize={["sm", "sm", "md", "md"]}
                              color="gray.700"
                            >
                              {order.amountFormat || "R$ 0,00"}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text
                              fontSize={["sm", "sm", "md", "md"]}
                              color="gray.700"
                            >{`Desconto`}</Text>
                            <Text
                              fontSize={["sm", "sm", "md", "md"]}
                              color="gray.700"
                            >
                              {order.differentiated.amountDiscountFormat ||
                                "R$ 0,00"}
                            </Text>
                          </Flex>
                        </>
                      )}

                      <Flex justify="space-between">
                        <Text
                          mb="4"
                          fontWeight="bold"
                          fontSize={["md", "md", "lg", "lg"]}
                        >{`Valor total`}</Text>
                        <Text
                          mb="4"
                          fontWeight="bold"
                          fontSize={["md", "md", "lg", "lg"]}
                        >
                          {Number(
                            order.amount -
                              (order.differentiated?.amountDiscount ?? 0)
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Text>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Box>

          <Flex flexDir="column" w="full">
            <Flex justify="space-between">
              <Text
                fontSize={["md", "md", "lg", "lg"]}
                color="gray.700"
              >{`Quantidade`}</Text>
              <Text
                fontSize={["md", "md", "lg", "lg"]}
                color="gray.700"
              >{`${totalItems} itens`}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text
                mb="4"
                fontWeight="bold"
                fontSize={["lg", "lg", "2xl", "2xl"]}
              >{`Valor total`}</Text>
              <Text
                mb="4"
                fontWeight="bold"
                fontSize={["lg", "lg", "2xl", "2xl"]}
              >{`${totalAmountFormat}`}</Text>
            </Flex>

            <Stack
              spacing="4"
              direction={["column", "column", "column", "row"]}
            >
              {!user.eCliente && (
                <Button
                  fontWeight={"normal"}
                  colorScheme="orange"
                  size="lg"
                  py="1.7 rem"
                  w="full"
                  fontSize="lg"
                  leftIcon={<Icon as={BiCartDownload} fontSize="30" />}
                  aria-disabled={
                    !validOrders ||
                    validMinimumAllOrder ||
                    validDifferentiatedAllOrder
                  }
                  disabled={
                    !validOrders ||
                    validMinimumAllOrder ||
                    validDifferentiatedAllOrder
                  }
                  onClick={
                    validOrders &&
                    !validMinimumAllOrder &&
                    !validDifferentiatedAllOrder
                      ? () => sendOrder({ isDraft: true })
                      : () => {}
                  }
                >
                  CRIAR RASCUNHO
                </Button>
              )}

              <Button
                fontWeight={"normal"}
                colorScheme="green"
                size="lg"
                py="1.7 rem"
                w="full"
                fontSize="lg"
                leftIcon={<Icon as={MdShoppingCartCheckout} fontSize="30" />}
                aria-disabled={
                  !validOrders ||
                  validMinimumAllOrder ||
                  validDifferentiatedAllOrder
                }
                disabled={
                  !validOrders ||
                  validMinimumAllOrder ||
                  validDifferentiatedAllOrder
                }
                onClick={
                  validOrders &&
                  !fetchingOrder &&
                  !validMinimumAllOrder &&
                  !validDifferentiatedAllOrder
                    ? () => handleSendOrder()
                    : () => {}
                }
              >
                ENVIAR PEDIDO
              </Button>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get<Me>("/auth/me");

  if (!(response.data.eVendedor || response.data.eCliente))
    return {
      redirect: {
        destination: "/inicio",
        permanent: true,
      },
    };

  return {
    props: {},
  };
};
