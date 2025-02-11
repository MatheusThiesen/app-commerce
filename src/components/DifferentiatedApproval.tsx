import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoading } from "../contexts/LoadingContext";
import { useDiscountScope } from "../hooks/queries/useDiscountScope";
import { Order } from "../hooks/queries/useOrder";
import { api } from "../service/apiClient";
import { Input } from "./Form/Input";
import { InputSelect } from "./Form/InputSelect";
import { Textarea } from "./Form/TextArea";

const createDifferentiatedFormSchema = z
  .object({
    type: z.enum(["VALOR", "PERCENTUAL"], {
      errorMap: () => ({
        message: "É obrigado selecionar tipo de desconto",
      }),
    }),
    value: z.coerce
      .number({
        errorMap: () => ({
          message: "É obrigado informar valor",
        }),
      })
      .nullable(),
    percent: z.coerce
      .string({
        errorMap: () => ({
          message: "É obrigado informar percentual",
        }),
      })
      .nullable(),
    reason: z.string().nullable(),
  })
  .refine((data) => (data.type === "VALOR" ? !!data.value : true), {
    message: "É obrigado informar valor",
    path: ["value"],
  })
  .refine((data) => (data.type === "PERCENTUAL" ? !!data.percent : true), {
    message: "É obrigado informar percentual",
    path: ["percent"],
  });

type CreateDifferentiatedProps = z.infer<typeof createDifferentiatedFormSchema>;

interface Differentiated {
  tipoDesconto: string;
  descontoPercentual?: number;
  descontoValor?: number;
  motivoDiferenciado?: string;
}

interface Props {
  order: Order;
}

export function DifferentiatedApproval({ order }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const { user } = useAuth();

  const discountScope = useDiscountScope({ returnNull: !user?.vendedorCodigo });
  const { push } = useRouter();

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const { setLoading } = useLoading();

  const { register, handleSubmit, formState, setValue, watch } =
    useForm<CreateDifferentiatedProps>({
      defaultValues: {
        type: order.tipoDesconto,
        percent: String(order.descontoPercentual),
        value: order.descontoValor,
      },
      resolver: zodResolver(createDifferentiatedFormSchema),
    });
  const { errors } = formState;

  const watchType = watch("type");
  const watchValue = watch("value");
  const watchPercent = watch("percent");
  const watchReason = watch("reason");

  async function handleSubmitDifferentiatedApproval(
    data: CreateDifferentiatedProps
  ) {
    setIsLoadingForm(true);
    setLoading(true);
    try {
      const normalized: Differentiated = {
        tipoDesconto: data.type,
        descontoPercentual:
          data.type === "PERCENTUAL" ? Number(data.percent) : undefined,
        descontoValor: data.type === "VALOR" ? Number(data.value) : undefined,
        motivoDiferenciado: data.reason ? data.reason : undefined,
      };

      await api.post(`/differentiated/approval/${order.codigo}`, normalized);

      push("/pedidos");
      toast({
        title: "Desconto aprovado",
        description: "O pedido será enviado.",
        status: "success",
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erro interno",
        description:
          "Houve um erro ao tentar aprovar o pedido. Tente novamente mais tarde.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoadingForm(false);
      setLoading(false);
    }
  }

  async function handleSubmitDifferentiatedReproval() {
    setIsLoadingForm(true);
    setLoading(true);
    try {
      await api.post(`/differentiated/reproval/${order.codigo}`, {
        motivoDiferenciado: watchReason,
      });

      push("/pedidos");

      toast({
        title: "Desconto reprovado",
        description: "O pedido foi reprovado.",
        status: "success",
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erro interno",
        description:
          "Houve um erro ao tentar reprovar o pedido. Tente novamente mais tarde.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoadingForm(false);
      setLoading(false);
      onClose();
    }
  }

  function onChangeInput(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    const maxPercentage =
      discountScope.data?.discountScope.percentualSolicitacao ?? 0;
    const maxValue = maxPercentage
      ? order.valorTotal * (maxPercentage / 100)
      : 0;

    switch (name) {
      case "type":
        setValue("type", value as any);
        setValue("value", null);
        setValue("percent", null);

        break;

      case "value":
        const valueDiscount = Number(value.replace(/\D/g, "")) / 100;

        if (valueDiscount <= maxValue) {
          setValue("value", valueDiscount);
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

      case "percent":
        const valuePercentage = value
          .replace(/[^0-9.,]/g, "")
          .replace(",", ".");

        if (Number(valuePercentage) <= maxPercentage) {
          if (Number(valuePercentage) >= 0) {
            setValue("percent", valuePercentage);
          }

          if (Number(valuePercentage) < 0) {
            setValue("percent", "0");
          }
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
  }

  function getCurrentAmountDiscount() {
    if (watchType === "VALOR") {
      return isNaN(Number(watchValue)) ? 0 : Number(watchValue);
    }

    if (watchType === "PERCENTUAL") {
      return isNaN(Number(watchPercent))
        ? 0
        : (Number(watchPercent) / 100) * order.valorTotal;
    }

    return 0;
  }

  const currentAmountDiscount = getCurrentAmountDiscount();

  return (
    <>
      <Box
        as="form"
        onSubmit={handleSubmit(handleSubmitDifferentiatedApproval)}
        bg="white"
        p="3"
        borderRadius="lg"
      >
        <Stack>
          <Input
            label="Mark-up"
            value={Number(
              (order.valorTotal - currentAmountDiscount) / order.valorTotalCusto
            ).toFixed(2)}
            name="markup"
            isReadOnly
          />

          <InputSelect
            label="Tipo de desconto"
            {...register("type", { onChange: onChangeInput })}
            error={
              !!errors?.type?.message
                ? String(errors?.type?.message)
                : undefined
            }
          >
            <option value="">Selecionar...</option>
            <option value="VALOR">Valor fixo</option>
            <option value="PERCENTUAL">Percentual</option>
          </InputSelect>

          {watchType}

          {watchType === "PERCENTUAL" && (
            <Input
              label="Percentual de desconto"
              {...register("percent")}
              onBlur={onChangeInput}
              onChange={onChangeInput}
              value={!!watchPercent ? `% ${watchPercent}` : ""}
              error={
                !!errors?.percent?.message
                  ? String(errors?.percent?.message)
                  : undefined
              }
            />
          )}

          {watchType === "VALOR" && (
            <Input
              label="Valor do desconto"
              {...register("value", { onChange: onChangeInput })}
              onBlur={onChangeInput}
              onChange={onChangeInput}
              value={Number(
                isNaN(Number(watchValue)) ? 0 : Number(watchValue)
              ).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
              error={
                !!errors?.value?.message
                  ? String(errors?.value?.message)
                  : undefined
              }
            />
          )}

          {!!watchType && (
            <Box position="relative">
              <Textarea
                label="Obervação"
                {...register("reason")}
                error={
                  !!errors?.reason?.message
                    ? String(errors?.reason?.message)
                    : undefined
                }
                maxLength={200}
              />
              <Text
                fontSize="sm"
                fontWeight="light"
                position="absolute"
                top="1"
                right="1"
              >
                {`${watchReason?.length ?? 0}/200`}
              </Text>
            </Box>
          )}

          <Flex flexDir="column" pt="6">
            <Flex justify="space-between">
              <Text
                fontSize={["sm", "sm", "md", "md"]}
                color="gray.700"
              >{`Quantidade`}</Text>
              <Text
                fontSize={["sm", "sm", "md", "md"]}
                color="gray.700"
              >{`${order.itens.length} itens`}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text
                fontSize={["sm", "sm", "md", "md"]}
                color="gray.700"
              >{`Valor pedido`}</Text>
              <Text fontSize={["sm", "sm", "md", "md"]} color="gray.700">
                {order.valorTotalFormat || "R$ 0,00"}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text
                fontSize={["sm", "sm", "md", "md"]}
                color="gray.700"
              >{`Desconto`}</Text>
              <Text fontSize={["sm", "sm", "md", "md"]} color="gray.700">
                {Number(currentAmountDiscount).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
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
              >
                {Number(
                  order.valorTotal - currentAmountDiscount
                ).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </Flex>
          </Flex>

          <Stack direction="row" w="full" columnGap="4">
            <Button
              colorScheme="red"
              flex={1}
              type="button"
              onClick={onOpen}
              disabled={isLoadingForm}
              isLoading={isLoadingForm}
            >
              Reprovar
            </Button>
            <Button
              colorScheme="green"
              flex={1}
              type="submit"
              disabled={isLoadingForm}
              isLoading={isLoadingForm}
            >
              Aprovar
            </Button>
          </Stack>
        </Stack>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reprovar desconto
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Você tem certeza? Você não poderá desfazer esta ação depois.
              </Text>

              <Box position="relative" mt="4">
                <Textarea
                  label="Obervação"
                  {...register("reason")}
                  error={
                    !!errors?.reason?.message
                      ? String(errors?.reason?.message)
                      : undefined
                  }
                  maxLength={200}
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  position="absolute"
                  top="1"
                  right="1"
                >
                  {`${watchReason?.length ?? 0}/200`}
                </Text>
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleSubmitDifferentiatedReproval}
                ml={3}
              >
                Reprovar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
