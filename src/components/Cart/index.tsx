import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  DrawerBody,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";

import { DrawerList } from "../DrawerList";
import { ProductStore } from "../ProductStore";

import { IoCart } from "react-icons/io5";
import { useStore } from "../../contexts/StoreContext";
import { useBrands } from "../../hooks/queries/useBrands";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { orders, totalItems, totalAmountFormat } = useStore();

  const { data } = useBrands({});

  function validateMinimumOrder(
    brandCode: number,
    orderAmount: number
  ): boolean {
    const findBrand = data?.brands.find((b) => b.codigo === brandCode);
    if (findBrand) return findBrand.valorPedidoMinimo - orderAmount > 0;

    return true;
  }

  const validMinimumAllOrder =
    orders
      .map((order) => validateMinimumOrder(order.brand.codigo, order.amount))
      .filter((f) => f).length > 0 || orders.length <= 0;

  return (
    <DrawerList
      title={`Carrinho (${totalItems})`}
      isOpen={isOpen}
      onClose={onClose}
      headerComponent={
        <Flex flexDir="column" w="full">
          <Flex justify="space-between">
            <Text
              fontSize={["sm", "sm", "sm", "sm"]}
              color="gray.700"
              fontWeight="300"
            >{`Quantidade`}</Text>
            <Text
              fontSize={["sm", "sm", "sm", "sm"]}
              color="gray.700"
              fontWeight="300"
            >{`${totalItems} itens`}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text
              mb="4"
              fontWeight="bold"
              fontSize={["lg", "lg", "lg", "lg"]}
            >{`Valor total`}</Text>
            <Text
              mb="4"
              fontWeight="bold"
              fontSize={["lg", "lg", "lg", "lg"]}
            >{`${totalAmountFormat}`}</Text>
          </Flex>

          <Button
            colorScheme="green"
            size="lg"
            w="full"
            fontSize="lg"
            onClick={
              validMinimumAllOrder
                ? () => {}
                : () => Router.push("/pedidos/novo/fechamento")
            }
            leftIcon={<Icon as={IoCart} fontSize={30} />}
            aria-disabled={validMinimumAllOrder}
            disabled={validMinimumAllOrder}
          >
            FECHAMENTO DO PEDIDO
          </Button>
        </Flex>
      }
    >
      <DrawerBody bg="gray.50" p="0">
        <Accordion mt="2rem" px="1rem" allowMultiple>
          {orders.map((order) => {
            const validateMinimum = validateMinimumOrder(
              order.brand.codigo,
              order.amount
            );

            return (
              <AccordionItem
                key={`${order.stockLocation.periodo}${order?.brand?.codigo}`}
                border={0}
                bg="white"
                mb="1rem"
                borderRadius="md"
              >
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontSize="lg">
                      {`${order?.brand?.descricao} - ${order.stockLocation.descricao} - ${order.amountFormat}`}

                      {validateMinimum && (
                        <Text
                          as="span"
                          fontWeight="bold"
                          color={"red"}
                        >{` ( VALOR MÍNIMO ${
                          data?.brands.find(
                            (b) => +b.codigo === +order.brand.codigo
                          )?.valorPedidoMinimoFormat
                        } )`}</Text>
                      )}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel borderTop="1px" borderColor="gray.100">
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
                      />
                    </Box>
                  ))}
                  <Text
                    mt="4"
                    textAlign="end"
                    fontSize="larger"
                    fontWeight="bold"
                  >
                    TOTAL {order.amountFormat}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </DrawerBody>
    </DrawerList>
  );
}
