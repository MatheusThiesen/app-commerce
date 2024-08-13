import { Button, ButtonProps, Flex, Icon, Text } from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ShoppingButtonProps extends ButtonProps {
  qtdItens: number;
  disabledTitle?: boolean;
}

export const ShoppingButton = ({
  qtdItens,
  disabledTitle = false,
  ...rest
}: ShoppingButtonProps) => {
  return (
    <Button
      mr={["2", "2", "2", "4"]}
      variant="unstyled"
      position="relative"
      display="flex"
      {...(rest as any)}
    >
      {qtdItens > 0 && (
        <Flex
          w="1.3rem"
          h="1.3rem"
          bg="white"
          borderRadius="full"
          position="absolute"
          top="-0.5rem"
          left="1.5rem"
          justify="center"
          align="center"
        >
          <Text fontSize={"small"} color={"gray.900"}>
            {qtdItens}
          </Text>
        </Flex>
      )}
      <Icon as={AiOutlineShoppingCart} color="white" fontSize={"2rem"} />

      {!disabledTitle && (
        <Text
          color="white"
          display={["none", "none", "block", "block"]}
          ml="0.5rem"
        >
          Carrinho
        </Text>
      )}
    </Button>
  );
};
