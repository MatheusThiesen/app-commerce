import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

import { Me } from "../../../@types/me";
import { setupAPIClient } from "../../../service/api";
import { withSSRAuth } from "../../../utils/withSSRAuth";

import { BiCartDownload } from "react-icons/bi";
import { IoArrowBack } from "react-icons/io5";
import { MdShoppingCartCheckout } from "react-icons/md";

import { Client } from "../../../components/Client";
import { HeaderNavigation } from "../../../components/HeaderNavigation";
import { ProductStore } from "../../../components/ProductStore";
import { PaymentCondition, useStore } from "../../../contexts/StoreContext";

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
} from "@chakra-ui/react";
import { InputSelect } from "../../../components/Form/InputSelect";

import { Input } from "../../../components/Form/Input";
import { useBrands } from "../../../hooks/queries/useBrands";
import { api } from "../../../service/apiClient";

interface Props {
  me: Me;
}

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

export default function CheckoutOrder({ me }: Props) {
  const {
    orders,
    client,
    priceList,
    totalAmountFormat,
    totalItems,
    validOrders,
    setPaymentCondition,
    sendOrder,
  } = useStore();

  const [paymentConditionOrders, setPaymentConditionOrders] = useState<
    PaymentConditionState[]
  >([]);

  const { data } = useBrands({});

  const validMinimumAllOrder =
    orders
      .map((order) => validateMinimumOrder(order.brand.codigo, order.amount))
      .filter((f) => f).length > 0;

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
        user={{ name: me.email }}
        isNotNavigation
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
                            order.paymentCondition && !validateMinimum
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
                      <Box mt="1rem">
                        <Text mb="2" fontSize="md" fontWeight="bold">
                          Condição de pagamento
                        </Text>
                        <ReactSelect
                          placeholder="Selecione..."
                          defaultValue={
                            order.paymentCondition && {
                              value: order.paymentCondition.codigo,
                              label: order.paymentCondition.descricao,
                            }
                          }
                          options={onSelectPaymentCondition({
                            brandCod: order.brand.codigo,
                            stockLocationPeriod: order.stockLocation.periodo,
                          })}
                          onChange={(e) => {
                            if (e)
                              setPaymentCondition({
                                brandCod: order.brand.codigo,
                                stockLocationPeriod:
                                  order.stockLocation.periodo,
                                paymentCondition: {
                                  codigo: Number(e.value),
                                  descricao: e.label,
                                },
                              });
                          }}
                        />
                      </Box>

                      <Box mt="1rem">
                        {order.differentiated?.isActive && (
                          <Stack>
                            <InputSelect name="type" label="Tipo de desconto">
                              <option value="">Selecionar...</option>
                              <option value="0">Valor fixo</option>
                              <option value="1">Percentual</option>
                            </InputSelect>

                            <Input label="Valor do desconto" name="value" />
                            <Input
                              label="Percentual de desconto"
                              name="percent"
                            />
                          </Stack>
                        )}
                      </Box>

                      <Accordion
                        defaultIndex={0}
                        allowToggle
                        borderRadius="4"
                        mt="2rem"
                      >
                        <AccordionItem border={1} mb="1rem" borderRadius="md">
                          <AccordionButton>
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

                      <Text fontSize="md" fontWeight="bold" mb={"1"} mr="2">
                        Diferenciado
                      </Text>
                      <Switch
                        isChecked={order.differentiated?.isActive}
                        onChange={(e) => {}}
                        size="lg"
                        colorScheme="blue"
                      />

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
                        >{`${order.amountFormat}`}</Text>
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
              <Button
                fontWeight={"normal"}
                colorScheme="orange"
                size="lg"
                py="1.7 rem"
                w="full"
                fontSize="lg"
                leftIcon={<Icon as={BiCartDownload} fontSize="30" />}
                aria-disabled={!validOrders || validMinimumAllOrder}
                disabled={!validOrders || validMinimumAllOrder}
                onClick={
                  validOrders && !validMinimumAllOrder
                    ? () => sendOrder({ isDraft: true })
                    : () => {}
                }
              >
                CRIAR RASCUNHO
              </Button>
              <Button
                fontWeight={"normal"}
                colorScheme="green"
                size="lg"
                py="1.7 rem"
                w="full"
                fontSize="lg"
                leftIcon={<Icon as={MdShoppingCartCheckout} fontSize="30" />}
                aria-disabled={!validOrders || validMinimumAllOrder}
                disabled={!validOrders || validMinimumAllOrder}
                onClick={
                  validOrders && !validMinimumAllOrder
                    ? () => sendOrder({ isDraft: false })
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

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

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
