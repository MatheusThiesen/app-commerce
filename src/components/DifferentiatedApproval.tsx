import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Order } from "../hooks/queries/useOrder";
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
      .number({
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

interface Props {
  order: Order;
}

export function DifferentiatedApproval({ order }: Props) {
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<CreateDifferentiatedProps>({
      defaultValues: {
        type: order.tipoDesconto,
        percent: order.descontoPercentual,
        value: order.descontoValor,
      },
      resolver: zodResolver(createDifferentiatedFormSchema),
    });
  const { errors } = formState;

  const watchType = watch("type");
  const watchValue = watch("value");
  const watchPercent = watch("percent");
  const watchReason = watch("reason");

  function handleSubmitDifferentiatedApproval(data: CreateDifferentiatedProps) {
    console.log(data);
  }

  function onChangeInput(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    switch (name) {
      case "type":
        setValue("type", value as any);
        setValue("value", null);
        setValue("percent", null);

        break;

      case "value":
        const valueDiscount = Number(value.replace(/\D/g, "")) / 100;

        setValue("value", valueDiscount);

        break;

      case "percent":
        const valuePercentage = value
          .replace(/[^0-9.,]/g, "")
          .replace(",", ".");

        if (Number(valuePercentage) >= 0 && Number(valuePercentage) <= 100) {
          setValue("percent", Number(valuePercentage));
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
    <Box
      as="form"
      onSubmit={handleSubmit(handleSubmitDifferentiatedApproval)}
      bg="white"
      p="3"
      borderRadius="lg"
    >
      <Stack>
        <InputSelect
          label="Tipo de desconto"
          {...register("type", { onChange: onChangeInput })}
          error={
            !!errors?.type?.message ? String(errors?.type?.message) : undefined
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
            {...register("percent", { onChange: onChangeInput })}
            value={watchPercent ? `% ${watchPercent}` : 0}
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
            <Text mb="4" fontWeight="bold" fontSize={["md", "md", "lg", "lg"]}>
              {Number(order.valorTotal - currentAmountDiscount).toLocaleString(
                "pt-br",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </Text>
          </Flex>
        </Flex>

        <Stack direction="row" w="full" columnGap="4">
          <Button colorScheme="red" flex={1} type="button">
            Reprovar
          </Button>
          <Button colorScheme="green" flex={1} type="submit">
            Aprovar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
