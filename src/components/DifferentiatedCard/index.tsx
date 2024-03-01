import { Box, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { Differentiated } from "../../contexts/StoreContext";
import { Textarea } from "../Form/TextArea";

interface Props {
  differentiated: Differentiated;
  colorTag?: string;
}

export const DifferentiatedCard = ({
  differentiated,
  colorTag = "purple.500",
}: Props) => {
  return (
    <Box
      w="full"
      display="block"
      bg="white"
      p="3"
      // h={"6.5rem"}
      borderRadius="lg"
    >
      <Stack
        direction={["column", "column", "row", "row"]}
        alignItems="start"
        justifyContent="space-between"
        h="full"
      >
        <Stack>
          <HStack>
            <Tag
              size="md"
              variant="solid"
              color="white"
              bg={colorTag}
              borderRadius="lg"
            >
              {differentiated.vendedor?.codigo}
            </Tag>
            <Text fontSize="md" fontWeight="light">
              {differentiated.tipoUsuario}
            </Text>
          </HStack>

          <Box mt="1.5">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {differentiated.vendedor?.nomeGuerra}
            </Text>
            <Text fontSize="sm" fontWeight="light" color="gray.600">
              {differentiated.vendedor?.nome}
            </Text>
          </Box>

          <Box mt="1.5">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Valor desconto: {differentiated.descontoCalculadoFormat}
            </Text>
            <Text fontSize="sm" fontWeight="light" color="gray.600">
              Tipo de desconto: {differentiated.tipoDesconto}
              {differentiated.tipoDesconto === "PERCENTUAL" &&
                ` (${differentiated.descontoPercentual}%)`}
            </Text>
          </Box>
        </Stack>

        <Box
          flex={1}
          pl={["0", "0", "8", "8"]}
          w={["full", "full", "auto", "auto"]}
        >
          <Textarea
            label="Observação"
            name="obs"
            isDisabled
            defaultValue={differentiated.motivoDiferenciado}
            resize="none"
            h="32"
          />
        </Box>
      </Stack>
    </Box>
  );
};
